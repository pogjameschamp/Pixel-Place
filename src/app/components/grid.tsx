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
}

const Grid: React.FC<GridProps> = ({ selectedColor }) => {
  const gridSize = 63; // Adjust grid size as needed
  const pixelSize = 10; // Keep pixel size the same
  const totalPixels = gridSize * gridSize;

  const [grid, setGrid] = useState<Pixel[]>([]); // Initialize with an empty grid

  const ws = useRef<WebSocket | null>(null); // WebSocket reference

  const fetchPixels = async () => {
    try {
      const response = await fetch('/api/pixels', {
        cache: 'no-store', // Ensure no cache
      });
      const pixels: Pixel[] = await response.json(); // Parse the response only once
      console.log("Fetched pixels:", pixels);

      const newGrid: Pixel[] = Array.from({ length: totalPixels }, (_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const existingPixel = pixels.find(pixel => pixel.x === x && pixel.y === y);
        return {
          id: index,
          x,
          y,
          color: existingPixel ? existingPixel.color : "#ffffff",
        };
      });

      setGrid(newGrid);
    } catch (error) {
      console.error("Failed to fetch pixels:", error);
    }
  };

  useEffect(() => {
    fetchPixels(); // Fetch pixels on component mount

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
  }, []); // No dependency array, to fetch only once when the component mounts

  const handlePixelClick = (index: number) => {
    const clickedPixel = grid[index];
    console.log(`Clicked pixel at X: ${clickedPixel.x}, Y: ${clickedPixel.y}`);

    const newGrid = [...grid];
    newGrid[index].color = selectedColor;
    setGrid(newGrid);

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
          className="cursor-pointer transition-filter duration-200 hover:brightness-75"
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
