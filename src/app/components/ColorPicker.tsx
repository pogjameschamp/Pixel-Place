"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onChange }) => {
  const [inputValue, setInputValue] = useState(currentColor);
  const [isValid, setIsValid] = useState(true);

  // Hex color validation regex: supports #RGB, #RRGGBB
  const isHexColor = (value: string) => /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value);

  // Update input field when parent updates the color
  useEffect(() => {
    setInputValue(currentColor);
  }, [currentColor]);

  const handleTextChange = (value: string) => {
    setInputValue(value);
    const valid = isHexColor(value);
    setIsValid(valid);
    if (valid) {
      onChange(value);
    }
  };

  const handleColorChange = (value: string) => {
    setInputValue(value);
    setIsValid(true);
    onChange(value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        🎨 Pick a Color
      </h3>

      <div className="flex items-center justify-center gap-6">
        {/* Color input */}
        <input
          type="color"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-16 h-16 rounded-lg cursor-pointer border border-gray-300 shadow-inner"
        />

        {/* Hex text input with validation */}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#000000"
          className={`w-36 text-center font-mono border rounded-lg ${
            isValid ? "border-gray-300" : "border-red-500 ring-1 ring-red-300"
          }`}
        />
      </div>

      <p
        className={`text-sm text-center mt-2 transition-opacity duration-200 h-5 ${
            isValid ? "text-transparent" : "text-red-500"
        }`}
        >
        Invalid hex color. Use format like <code>#123ABC</code> or <code>#fff</code>
    </p>

    </div>
  );
};

export default ColorPicker;
