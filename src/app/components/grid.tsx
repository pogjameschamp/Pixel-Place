"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { addPixel, fetchPixels } from "@/actions/actions";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FixedSizeGrid as Grid } from 'react-window';

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface GridProps {
  selectedColor: string;
}

const GridComponent: React.FC<GridProps> = ({ selectedColor }) => {
  const gridSize = 63;
  const pixelSize = 10;
  const totalPixels = gridSize * gridSize;
  const [user] = useAuthState(auth);
  const [grid, setGrid] = useState<Pixel[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const loadPixels = async () => {
    const cachedPixels = localStorage.getItem('pixels');
    if (cachedPixels) {
      setGrid(JSON.parse(cachedPixels));
    }

    const fetchedPixels = await fetchPixels(); // Call the server action
    const newGrid: Pixel[] = Array.from({ length: totalPixels }, (_, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      const existingPixel = fetchedPixels.find(pixel => pixel.x === x && pixel.y === y);
      return {
        id: index,
        x,
        y,
        color: existingPixel ? existingPixel.color : "#ffffff",
      };
    });

    setGrid(newGrid);
    localStorage.setItem('pixels', JSON.stringify(newGrid)); // Cache the new grid
  };

  useEffect(() => {
    loadPixels(); // Load pixels on component mount

    const wsUrl = "https://rplace-2260a4bfaead.herokuapp.com";
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const updatedPixel: Pixel = JSON.parse(event.data);
      setGrid(prevGrid =>
        prevGrid.map(pixel =>
          pixel.x === updatedPixel.x && pixel.y === updatedPixel.y ? updatedPixel : pixel
        )
      );
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handlePixelClick = (index: number) => {
    const clickedPixel = grid[index];
    const newGrid = [...grid];
    newGrid[index].color = selectedColor;
    setGrid(newGrid);
    localStorage.setItem('pixels', JSON.stringify(newGrid)); // Update cache

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          id: clickedPixel.id,
          x: clickedPixel.x,
          y: clickedPixel.y,
          color: selectedColor,
        })
      );
    }

    const userId = user?.uid || "";
    if (userId) {
      addPixel(clickedPixel.x, clickedPixel.y, selectedColor, userId)
        .then(() => console.log("Pixel added successfully"))
        .catch((error) => console.error("Failed to add pixel:", error));
    } else {
      console.error("User ID is not defined");
    }
  };

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const pixelIndex = rowIndex * gridSize + columnIndex;
    const pixel = grid[pixelIndex];
    const backgroundColor = pixel ? pixel.color : "#ffffff";

    return (
      <div
        style={{
          ...style,
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          backgroundColor: backgroundColor,
          cursor: "pointer",
          transition: "filter 0.2s",
        }}
        onClick={() => pixel && handlePixelClick(pixel.id)}
        className="hover:brightness-75"
      />
    );
  };

  return (
    <div className="grid-container">
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
  );
};

export default GridComponent;