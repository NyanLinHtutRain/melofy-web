"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light"> {/* Changed to light */}
      {children}
    </ThemeProvider>
  );
}