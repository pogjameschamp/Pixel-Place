"use client";
import React, { useState } from "react";
import Grid from '../components/grid';
import ColorPicker from '@/components/colourpicker';

const ClientPage: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Grid Container */}
      <div className="flex items-center justify-center w-full h-full">
        <div className="max-w-full max-h-full">
          <Grid/>
        </div>
      </div>

      {/* Color Picker in the Bottom Left */}
      {/* <ColorPicker
        selectedColor={selectedColor}
        onColorChange={(color: string) => setSelectedColor(color)}
      /> */}
    </div>
  );
};

export default ClientPage;
