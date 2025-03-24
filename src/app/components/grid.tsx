"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ColorPicker from './ColorPicker';
import { addPixel, fetchPixels } from "@/actions/actions";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import debounce from "lodash/debounce";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;
const PIXEL_SIZE = 25;

const COLUMNS = CANVAS_WIDTH / PIXEL_SIZE; // 64
const ROWS = CANVAS_HEIGHT / PIXEL_SIZE;   // 36

interface PixelData {
  color: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const Grid: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("#000000");
  const [pixelData, setPixelData] = useState<PixelData[]>(
    Array(COLUMNS * ROWS).fill({ color: "#ffffff" })
  );
  const [user] = useAuthState(auth);

  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function load() {
      const fetched = await fetchPixels();
      const newData = [...pixelData];

      fetched.forEach((pixel) => {
        const index = pixel.y * COLUMNS + pixel.x;
        newData[index] = {
          color: pixel.color,
          user: pixel.user ?? null,
        };
      });

      setPixelData(newData);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePixelClick = async (index: number) => {
    const x = index % COLUMNS;
    const y = Math.floor(index / COLUMNS);

    if (!user) {
      console.warn("You must be logged in to place a pixel.");
      return;
    }

    const updated = [...pixelData];
    updated[index] = { color: currentColor, user: { id: user.uid, name: user.displayName ?? "Anonymous", email: user.email ?? "" } };
    setPixelData(updated);

    try {
      await addPixel(x, y, currentColor, user.uid);
    } catch (err) {
      console.error("Error saving pixel:", err);
    }
  };

  const handleMouseEnter = useCallback((index: number, event: React.MouseEvent) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    requestAnimationFrame(() => {
      setHoveredIndex(index);
      setHoverPosition({ x: event.clientX, y: event.clientY });
      setHoveredUser(pixelData[index]?.user?.name || null);
    });
  }, [pixelData]);

  const handleMouseLeave = useCallback(() => {
    hideTimeout.current = setTimeout(() => {
      setHoveredIndex(null);
      setHoverPosition(null);
      setHoveredUser(null);
    }, 50);
  }, []);

  const debouncedHandleMouseEnter = useMemo(
    () => debounce((index: number, event: React.MouseEvent) => handleMouseEnter(index, event), 16),
    [handleMouseEnter]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <div
        className="relative bg-white"
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, ${PIXEL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${PIXEL_SIZE}px)`,
          border: "1px solid #ccc",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {Array.from({ length: COLUMNS * ROWS }).map((_, index) => (
          <div
            key={index}
            onMouseEnter={(e) => debouncedHandleMouseEnter(index, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handlePixelClick(index)}
            style={{
              width: `${PIXEL_SIZE}px`,
              height: `${PIXEL_SIZE}px`,
              backgroundColor:
                hoveredIndex === index ? currentColor : pixelData[index]?.color || "#ffffff",
              border: "0.5px solid #e5e5e5",
              transition: "background-color 0.1s ease-in-out",
              cursor: "pointer",
            }}
          />
        ))}
        {hoveredIndex !== null && hoverPosition && (
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
              transition: "all 0.1s ease-out",
              pointerEvents: "none",
            }}
          >
            <p>Placed by: {hoveredUser ?? "No User"}</p>
          </div>
        )}
      </div>

      <ColorPicker currentColor={currentColor} onChange={setCurrentColor} />
    </div>
  );
};

export default Grid;
