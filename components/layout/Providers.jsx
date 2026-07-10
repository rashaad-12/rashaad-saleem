"use client";

import { ThemeProvider } from "next-themes";
import { LazyMotion, domAnimation } from "motion/react";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </ThemeProvider>
  );
}
