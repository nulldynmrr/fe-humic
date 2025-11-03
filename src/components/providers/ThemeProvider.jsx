"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

export function CustomThemeProvider({ children }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
