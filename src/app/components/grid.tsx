"use client";
import React, { useState, useEffect } from "react";
import prisma from "@/lib/db"; // Import your Prisma client

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

  // Function to fetch pixels directly inside the component
  const fetchPixels = async () => {
    try {
      const pixels = await prisma.pixel.findMany(); // Directly query Prisma from here
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
  }, []); // No dependency array, to fetch only once when the component mounts

  const handlePixelClick = (index: number) => {
    const clickedPixel = grid[index];
    console.log(`Clicked pixel at X: ${clickedPixel.x}, Y: ${clickedPixel.y}`);

    const newGrid = [...grid];
    newGrid[index].color = selectedColor;
    setGrid(newGrid);

    // You can add the WebSocket logic and API call here if needed
  };

  return (
    <div className="flex flex-col items-center">
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
      <p className="mt-4 text-center">
        {grid.map(pixel => (
          <span key={pixel.id}>
            ({pixel.x}, {pixel.y}): {pixel.color} <br />
          </span>
        ))}
      </p>
    </div>
  );
};

export default Grid;
