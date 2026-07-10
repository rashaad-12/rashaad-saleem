import localFont from "next/font/local";

export const erode = localFont({
  src: [
    { path: "../assets/fonts/Erode-var.woff2", weight: "300 700", style: "normal" },
  ],
  variable: "--font-erode",
  display: "swap",
  preload: true,
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const switzer = localFont({
  src: [
    { path: "../assets/fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const martian = localFont({
  src: [
    {
      path: "../assets/fonts/MartianMono-var.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-martian",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SF Mono", "Menlo", "Consolas", "monospace"],
  adjustFontFallback: false,
});

export const fontVariables = `${erode.variable} ${switzer.variable} ${martian.variable}`;
