"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import debounce from 'lodash/debounce';

const CANVAS_WIDTH = '80vw';
const CANVAS_HEIGHT = '80vh';
const PIXEL_ROW_COUNT = 60;  
const PIXEL_COL_COUNT = 120; 

interface NodeProps {
  isHovered: boolean;
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: () => void;
  size: { width: string; height: string };
  user?: { name: string } | null;
}

const Node: React.FC<NodeProps> = ({ isHovered, onMouseEnter, onMouseLeave, size, user }) => (
  <div 
    className={`outline outline-1 outline-[rgba(144,175,175,0.75)] inline-block transition-colors duration-200 ${isHovered ? 'bg-blue-500' : 'bg-white'}`}
    style={{ width: size.width, height: size.height }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  ></div>
);

const TestCanvas: React.FC = () => {
  const [grid, setGrid] = useState<JSX.Element[][]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [nodeSize, setNodeSize] = useState({ width: '0px', height: '0px' });
  const [hoverPosition, setHoverPosition] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const calculateNodeSize = () => {
      const canvas = document.getElementById('grid-canvas');
      if (canvas) {
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const width = (canvasWidth / PIXEL_COL_COUNT) + 'px';
        const height = (canvasHeight / PIXEL_ROW_COUNT) + 'px';
        setNodeSize({ width, height });
      }
    };

    calculateNodeSize();
    window.addEventListener('resize', calculateNodeSize);
    return () => window.removeEventListener('resize', calculateNodeSize);
  }, []);

  const handleMouseEnter = useCallback(
    (row: number, col: number, event: React.MouseEvent) => {
      requestAnimationFrame(() => {
        setHoveredCell({ row, col });
        setHoverPosition({
          x: event.clientX,
          y: event.clientY,
        });
      });
    },
    []
  );

  const debouncedHandleMouseEnter = useMemo(
    () => debounce(handleMouseEnter, 100), // Increased debounce time for better performance
    [handleMouseEnter]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
    setHoverPosition(null);
  }, []);

  useEffect(() => {
    const newGrid: JSX.Element[][] = [];
    for (let row = 0; row < PIXEL_ROW_COUNT; row++) {
      const currentRow: JSX.Element[] = [];
      for (let col = 0; col < PIXEL_COL_COUNT; col++) {
        currentRow.push(
          <Node 
            key={`${row}-${col}`}
            isHovered={hoveredCell?.row === row && hoveredCell?.col === col}
            onMouseEnter={(event) => debouncedHandleMouseEnter(row, col, event)}
            onMouseLeave={handleMouseLeave}
            size={nodeSize}
            user={{ name: "Test User" }} // Replace with actual user data when available
          />
        );
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  }, [hoveredCell, nodeSize, debouncedHandleMouseEnter, handleMouseLeave]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 left-4 z-10 space-x-2">
              <button onClick={() => zoomIn()} className="bg-blue-500 text-white px-4 py-2 rounded">Zoom In</button>
              <button onClick={() => zoomOut()} className="bg-blue-500 text-white px-4 py-2 rounded">Zoom Out</button>
              <button onClick={() => resetTransform()} className="bg-blue-500 text-white px-4 py-2 rounded">Reset</button>
            </div>
            <TransformComponent>
              <div 
                id="grid-canvas"
                className="inline-block text-[0] bg-gray-100"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              >
                {grid.map((row, rowId) => (
                  <div key={rowId} className="whitespace-nowrap">
                    {row}
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      
      {hoveredCell && hoverPosition && (
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
          <p>Placed by: Test User</p>
        </div>
      )}
    </div>
  );
};

export default TestCanvas;
