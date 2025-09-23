"use client";

import { useTheme } from "./ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Sizes tuned to the reference PNGs
  const trackW = 84;
  const trackH = 40;
  const thumb = 32;   // blue circle size
  const pad = 4;      // inner padding inside track

  // How far the thumb slides when going to the right side
  const translateX = trackW - (thumb + pad * 2);

  return (
    <button
      aria-label="Toggle dark/light mode"
      aria-pressed={isDark}
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      className="fixed top-5 right-6 z-50"
      style={{ width: trackW, height: trackH }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={[
          "relative w-full h-full rounded-full border shadow-sm transition-colors",
          // Track colors (match design)
          isDark
            ? "bg-[#6B7380] border-[#5d6571]"    // dark track
            : "bg-[#E9EDF2] border-[#D8DEE6]",   // light track
        ].join(" ")}
      >
        {/* Left static icon (moon) */}
        <Moon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          // Muted gray like the mock
          color={isDark ? "#C0C5CC" : "#AEB5BF"}
          strokeWidth={2}
        />

        {/* Right static icon (sun) */}
        <Sun
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          color={isDark ? "#C0C5CC" : "#AEB5BF"}
          strokeWidth={2}
        />

        {/* Blue sliding thumb */}
        <div
          className="absolute top-1 left-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-white/20
                     flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            width: thumb,
            height: thumb,
            transform: `translateX(${isDark ? 0 : translateX}px)`,
            background: "var(--infoHighlight-gradient)", // design blue
          }}
        >
          {/* Icon inside the thumb (white) */}
          {isDark ? (
            <Moon size={16} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Sun size={16} color="#FFFFFF" strokeWidth={2} />
          )}
        </div>
      </div>
    </button>
  );
}
