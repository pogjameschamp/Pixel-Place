"use client";
import React, { useState } from "react";
import Grid from './components/grid';
import ColorPicker from '@/components/colourpicker';

interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ClientPageProps {
  pixels: Pixel[];
}

const ClientPage: React.FC<ClientPageProps> = ({ pixels }) => {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Grid Container */}
      <div className="flex items-center justify-center w-full h-full">
        <div className="max-w-full max-h-full">
          <Grid selectedColor={selectedColor} initialPixels={pixels} />
        </div>
      </div>

      {/* Color Picker in the Bottom Left */}
      <ColorPicker
        selectedColor={selectedColor}
        onColorChange={(color: string) => setSelectedColor(color)}
      />
    </div>
  );
}

export default ClientPage;
