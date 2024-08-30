"use client";
import React from "react";
import { Input } from "./ui/input";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="fixed bottom-20 left-20 flex items-center space-x-4">
      {/* Color Input */}
      <Input
        type="text"
        value={selectedColor}
        onChange={(e) => onColorChange(e.target.value)}
        placeholder="#ffcccc"
        className="w-40 h-12 text-lg p-4" // Increased width, height, font size, and padding
      />
      
      {/* Color Display Square */}
      <div
        className="w-12 h-12 border border-gray-300 rounded-md shadow-md"
        style={{ backgroundColor: selectedColor }}
      />
    </div>
  );
};

export default ColorPicker;
