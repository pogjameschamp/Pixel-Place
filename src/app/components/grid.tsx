"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { addPixel, fetchPixels } from "@/actions/actions";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FixedSizeGrid as Grid } from 'react-window';
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import debounce from 'lodash/debounce';
import { useToast } from "@/hooks/use-toast";


interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
  user?: { id: string; name: string; email: string } | null;
}

const GridComponent: React.FC = () => {
  const gridSize = 63;
  const pixelSize = 10;
  const totalPixels = gridSize * gridSize;
  const [user] = useAuthState(auth);
  const [grid, setGrid] = useState<Pixel[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const [hoveredPixel, setHoveredPixel] = useState<Pixel | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const selectedColorRef = useRef<string>(currentColor);
  const [canPlacePixel, setCanPlacePixel] = useState<boolean>(true)
  const { toast } = useToast()

  const loadPixels = useCallback(async () => {
    const cachedPixels = localStorage.getItem('pixels');
    if (cachedPixels) {
      setGrid(JSON.parse(cachedPixels));
    }

    const fetchedPixels = await fetchPixels();
    const newGrid: Pixel[] = Array.from({ length: totalPixels }, (_, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      const existingPixel = fetchedPixels.find(pixel => pixel.x === x && pixel.y === y);
      return {
        id: index,
        x,
        y,
        color: existingPixel ? existingPixel.color : "#ffffff",
        user: existingPixel?.user || null,
      };
    });

    setGrid(newGrid);
    localStorage.setItem('pixels', JSON.stringify(newGrid));
  }, [gridSize, totalPixels]);

  useEffect(() => {
    loadPixels();

    const wsUrl = "wss://rplace-2260a4bfaead.herokuapp.com";
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const updatedPixel: Pixel = JSON.parse(event.data);
      console.log('Received updated pixel:', updatedPixel);

      setGrid((prevGrid) =>
        prevGrid.map((pixel) =>
          pixel.x === updatedPixel.x && pixel.y === updatedPixel.y ? updatedPixel : pixel
        )
      );
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [loadPixels]);

  const handlePixelClick = useCallback(
    (index: number) => {

      if (!canPlacePixel) {
        toast({ title: "Cooldown", description: "You cannot place another pixel for 10 seconds.", duration: 3000 });
        console.log("CANT PLACE THE PIXEL!")
        return;
      }

      setCanPlacePixel(false);

      const clickedPixel = grid[index];
      const newGrid = [...grid];
      newGrid[index].color = selectedColorRef.current;
      setGrid(newGrid);
      localStorage.setItem("pixels", JSON.stringify(newGrid));

      const userId = user?.uid || "";
      const userName = user?.displayName || "Unknown User";

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            id: clickedPixel.id,
            x: clickedPixel.x,
            y: clickedPixel.y,
            color: selectedColorRef.current,
            user: { id: userId, name: userName },
          })
        );
      }

      if (userId) {
        addPixel(clickedPixel.x, clickedPixel.y, selectedColorRef.current, userId)
          .then((pixelWithUser) => {
            setGrid((prevGrid) =>
              prevGrid.map((pixel) =>
                pixel.x === pixelWithUser.x && pixel.y === pixelWithUser.y
                  ? pixelWithUser
                  : pixel
              )
            );
            console.log("SET TO FALSE")
            toast({ title: "Pixel Placed", description: "You placed a pixel!", duration: 3000 });
            setTimeout(() => setCanPlacePixel(true), 10000); // 10 seconds
          })
          .catch((error) => console.error("Failed to add pixel:", error));
      } else {
        console.error("User ID is not defined");
      }
    },
    [grid, user, canPlacePixel]
  );

  const handleMouseEnter = useCallback(
    (pixel: Pixel, event: React.MouseEvent) => {
      setHoveredPixel(pixel);
      setHoverPosition({
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredPixel(null);
    setHoverPosition(null);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color);
    selectedColorRef.current = color;
  }, []);

  const Cell = useMemo(() => {
    return ({
      columnIndex,
      rowIndex,
      style,
    }: {
      columnIndex: number;
      rowIndex: number;
      style: React.CSSProperties;
    }) => {
      const pixelIndex = rowIndex * gridSize + columnIndex;
      const pixel = grid[pixelIndex];
      const backgroundColor = pixel ? pixel.color : "#ffffff";

      return (
        <div
          style={style}
          className="cell-wrapper"
          onMouseEnter={(e) => pixel && handleMouseEnter(pixel, e)}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: backgroundColor,
              cursor: "pointer",
              transition: "filter 0.2s",
            }}
            onClick={() => pixel && handlePixelClick(pixelIndex)}
            className="hover:brightness-75"
          />
        </div>
      );
    };
  }, [grid, handleMouseEnter, handleMouseLeave, handlePixelClick]);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-visible flex flex-col justify-center items-center">
      <div className="flex items-center justify-center">
        <div className="max-w-full max-h-full">
          <Grid
            columnCount={gridSize}
            columnWidth={pixelSize}
            height={gridSize * pixelSize}
            rowCount={gridSize}
            rowHeight={pixelSize}
            width={gridSize * pixelSize}
          >
            {Cell}
          </Grid>
        </div>
      </div>

      {/* Centered Color Picker */}
      <div className="mt-8 flex items-center space-x-4">
        <Input
          type="text"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#ffcccc"
          className="w-40 h-12 text-lg p-4"
        />
        <div
          className="w-12 h-12 border border-gray-300 rounded-md shadow-md"
          style={{ backgroundColor: currentColor }}
        />
      </div>

      {hoveredPixel && hoverPosition &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: hoverPosition.y + 10,
              left: hoverPosition.x + 10,
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          >
            <p>Placed by: {hoveredPixel.user ? hoveredPixel.user.name : "No User"}</p>
          </div>,
          document.body
        )}
    </div>
  );
};

export default GridComponent;
