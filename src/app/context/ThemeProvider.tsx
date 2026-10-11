"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// useLayoutEffect corre antes del primer pintado (evita el parpadeo); en el servidor no existe
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Misma regla que el script inline del layout: preferencia guardada o, si no hay, la del sistema
function readPreferredTheme(): boolean {
  try {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch {
    return document.documentElement.classList.contains("dark");
  }
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Se reaplica la clase en vez de confiar en la que puso el script: React 19 puede limpiar los
  // atributos de <html> al hidratar y el tema se perdería al cambiar de página.
  useIsomorphicLayoutEffect(() => {
    const dark = readPreferredTheme();
    document.documentElement.classList.toggle("dark", dark);
    setIsDarkMode(dark);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    try {
      localStorage.setItem("theme", newIsDarkMode ? "dark" : "light");
    } catch {
      // sin persistencia
    }
    document.documentElement.classList.toggle("dark", newIsDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};
