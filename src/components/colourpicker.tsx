"use client";
import React from "react";
import { Input } from "./ui/input";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="fixed bottom-20 left-20">
      <Input
        type="text"
        value={selectedColor}
        onChange={(e) => onColorChange(e.target.value)}
        placeholder="#ffcccc"
        className="w-40 h-12 text-lg p-4" // Increased width, height, font size, and padding
      />
    </div>
  );
};

export default ColorPicker;
