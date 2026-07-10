"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const label = mounted
    ? resolvedTheme === "dark"
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Switch colour theme";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-9 shrink-0 place-items-center rounded-pill border border-line text-dim transition-colors duration-200 hover:border-sage hover:text-sage"
    >
      <svg
        className="theme-icon block"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M8 1a7 7 0 0 0 0 14z" fill="currentColor" />
      </svg>
    </button>
  );
}
