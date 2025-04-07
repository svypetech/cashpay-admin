"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface DarkModeContextType {
  darkMode: boolean | null; // Set initial state to null to avoid SSR mismatch
  setDarkMode: (mode: boolean) => void;
}

// Create Context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Provider Component
export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Load theme from localStorage after mounting (avoiding hydration mismatch)
    const storedTheme = localStorage.getItem("theme") || "light";
    const isDarkMode = storedTheme === "dark";
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode: toggleDarkMode }}>
      {darkMode !== null ? children : null} {/* Prevent rendering before theme is loaded */}
    </DarkModeContext.Provider>
  );
}

// Custom Hook to use DarkMode
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
