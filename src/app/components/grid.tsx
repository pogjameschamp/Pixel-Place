"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ColorPicker from './ColorPicker';
import { addPixel, fetchPixels } from "@/actions/actions";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import debounce from "lodash/debounce";
import { toast } from "@/hooks/use-toast";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;
const PIXEL_SIZE = 25;
const COOLDOWN_SECONDS = 10;

const COLUMNS = CANVAS_WIDTH / PIXEL_SIZE;
const ROWS = CANVAS_HEIGHT / PIXEL_SIZE;

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
  const [pixelData, setPixelData] = useState<PixelData[]>(Array(COLUMNS * ROWS).fill({ color: "#ffffff" }));
  const [user] = useAuthState(auth);
  const [userPixelCount, setUserPixelCount] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const ENABLE_COOLDOWN = false;

  useEffect(() => {
    async function load() {
      const fetched = await fetchPixels();
      const newData = [...pixelData];
      let count = 0;

      fetched.forEach((pixel) => {
        const index = pixel.y * COLUMNS + pixel.x;
        newData[index] = {
          color: pixel.color,
          user: pixel.user ?? null,
        };
        if (user && pixel.user?.id === user.uid) count++;
      });

      setPixelData(newData);
      setUserPixelCount(count);
    }

    if (user) load();

    ws.current = new WebSocket("wss://your-rplace-ws-server-05f597db5865.herokuapp.com/");
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { x, y, color, user } = data;
      const index = y * COLUMNS + x;

      setPixelData((prev) => {
        const copy = [...prev];
        copy[index] = { color, user };
        return copy;
      });
    };

    return () => ws.current?.close();
  }, [user]);

  // Cooldown Timer
  useEffect(() => {
    const checkCooldown = () => {
      const expiry = Number(localStorage.getItem("cooldown_expiry"));
      const now = Date.now();
      if (expiry > now) {
        setCooldownRemaining(Math.ceil((expiry - now) / 1000));
      } else {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePixelClick = async (index: number) => {
    if (!user) {
      console.warn("You must be logged in to place a pixel.");
      return;
    }

    if (ENABLE_COOLDOWN && cooldownRemaining > 0) {
      toast({
        title: "⏳ Cooldown active!",
        description: "You can place another pixel after the cooldown ends.",
        variant: "destructive",
      });
      return;
    }
    

    const x = index % COLUMNS;
    const y = Math.floor(index / COLUMNS);

    const updated = [...pixelData];
    updated[index] = {
      color: currentColor,
      user: {
        id: user.uid,
        name: user.displayName ?? "Anonymous",
        email: user.email ?? "",
      },
    };
    setPixelData(updated);
    setUserPixelCount((prev) => prev + 1);

    try {
      await addPixel(x, y, currentColor, user.uid);
      ws.current?.send(
        JSON.stringify({
          x,
          y,
          color: currentColor,
          user: {
            id: user.uid,
            name: user.displayName ?? "Anonymous",
            email: user.email ?? "",
          },
        })
      );

      if (ENABLE_COOLDOWN) {
        const cooldownExpiry = Date.now() + COOLDOWN_SECONDS * 1000;
        localStorage.setItem("cooldown_expiry", cooldownExpiry.toString());
        setCooldownRemaining(COOLDOWN_SECONDS);
      }
      
      if (ENABLE_COOLDOWN) {
        toast({
          title: "✅ Pixel placed!",
          description: `You can place another in ${COOLDOWN_SECONDS} seconds.`,
        });
      }
      
    } catch (err) {
      console.error("Error saving pixel:", err);
    }
  };

  const handleMouseEnter = useCallback((index: number, event: React.MouseEvent) => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);

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

      {/* Row layout for picker and user info */}
      <div className="flex space-x-4">
        <ColorPicker currentColor={currentColor} onChange={setCurrentColor} />
        {user && (
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">User Stats</h3>
            <p><strong>Name:</strong> {user.displayName}</p>
            <p><strong>Pixels Placed:</strong> {userPixelCount}</p>
            {cooldownRemaining > 0 && (
              <p className="text-red-500 font-semibold mt-2">
                Cooldown: {cooldownRemaining}s
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grid;
