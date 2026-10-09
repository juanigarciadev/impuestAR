"use client"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../app/context/ThemeProvider";
import { Button } from "./ui/Button";

export default function DarkMode() {
    const { isDarkMode, toggleTheme } = useTheme();

    return(
        <Button color="secondary" rounded className="!p-2" aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"} aria-pressed={isDarkMode} onClick={toggleTheme} icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />} />
    )
}
