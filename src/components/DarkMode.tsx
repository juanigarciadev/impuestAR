"use client"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../app/context/ThemeProvider";
import { IconButton } from "./ui/Button";

export default function DarkMode() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <IconButton color="secondary" rounded size="sm" label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"} aria-pressed={isDarkMode} onClick={toggleTheme} icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />} />
    )
}
