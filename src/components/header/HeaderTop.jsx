import React, { useEffect, useState } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";

const MESSAGES = [
  "Livraison GRATUITE sur tous les produits",
  "-10 % sur Chic Girl — stocks limités !",
];

const DURATION = 4500; // loader duration

export default function TopLuxuryBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (paused) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const value = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(value);

      if (value === 100) {
        clearInterval(timer);
        setProgress(0);
        setIndex((prev) => (prev + 1) % MESSAGES.length);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [paused, index]);

  return (
    <div className="w-full bg-black text-white text-[10px] tracking-widest uppercase py-2 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-1 flex items-center justify-center relative h-5">
        {/* TEXT */}
        {MESSAGES.map((text, i) => (
          <p
            key={i}
            className={`
              absolute flex items-center gap-3
              transition-all duration-700 ease-out
              ${
                index === i
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }
            `}
          >
            <span>{text}</span>
          </p>
        ))}

        {/* CIRCULAR LOADER */}
        <div className="absolute left-2 w-4 h-4">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              d="M18 2
                 a 16 16 0 0 1 0 32
                 a 16 16 0 0 1 0 -32"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <path
              d="M18 2
                 a 16 16 0 0 1 0 32
                 a 16 16 0 0 1 0 -32"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
            />
          </svg>
        </div>

        {/* PAUSE / PLAY */}
        <button
          onClick={() => setPaused((p) => !p)}
          className="absolute right-2"
          aria-label="Pause banner"
        >
          {paused ? (
            <PlayIcon className="w-4 h-4 text-white" />
          ) : (
            <PauseIcon className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
