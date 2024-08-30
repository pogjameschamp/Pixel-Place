"use client";
import React, { useState, useEffect, useRef } from "react";
import { addPixel } from "@/actions/actions";

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface GridProps {
  selectedColor: string;
  initialPixels: Pixel[];
}

const Grid: React.FC<GridProps> = ({ selectedColor, initialPixels }) => {
  const gridSize = 63; // Adjust grid size as needed
  const pixelSize = 10; // Keep pixel size the same
  const totalPixels = gridSize * gridSize;

  const [grid, setGrid] = useState<Pixel[]>(() => {
    // Initialize the grid based on initialPixels
    const newGrid: Pixel[] = Array.from({ length: totalPixels }, (_, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      const existingPixel = initialPixels.find(pixel => pixel.x === x && pixel.y === y);
      return {
        id: index,
        x,
        y,
        color: existingPixel ? existingPixel.color : "#ffffff",
      };
    });
    return newGrid;
  });

  const ws = useRef<WebSocket | null>(null); // WebSocket reference

  useEffect(() => {
    // Connect to the WebSocket server
    const wsUrl = "https://rplace-2260a4bfaead.herokuapp.com";
    ws.current = new WebSocket(wsUrl);

    // Listen for messages from the server
    ws.current.onmessage = (event) => {
      const updatedPixel: Pixel = JSON.parse(event.data);

      // Update the grid with the new pixel data
      setGrid(prevGrid =>
        prevGrid.map(pixel =>
          pixel.x === updatedPixel.x && pixel.y === updatedPixel.y ? updatedPixel : pixel
        )
      );
    };

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handlePixelClick = (index: number) => {
    const clickedPixel = grid[index];
    console.log(`Clicked pixel at X: ${clickedPixel.x}, Y: ${clickedPixel.y}`);

    // Update pixel color locally
    const newGrid = [...grid];
    newGrid[index].color = selectedColor;
    setGrid(newGrid);

    // Send the pixel data to the server via WebSocket
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
    // Save to the database
    addPixel(clickedPixel.x, clickedPixel.y, selectedColor);
  };

  return (
    <div
      className="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${pixelSize}px)`,
        gap: "0px",
        padding: "0px",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {grid.map((pixel) => (
        <div
          key={pixel.id}
          className="cursor-pointer transition-filter duration-200"
          style={{
            width: `${pixelSize}px`,
            height: `${pixelSize}px`,
            backgroundColor: pixel.color,
          }}
          onClick={() => handlePixelClick(grid.indexOf(pixel))}
        />
      ))}
    </div>
  );
};

export default Grid;
