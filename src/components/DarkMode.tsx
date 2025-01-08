"use client"
import MoonIcon from "@/icons/MoonIcon";
import { useTheme } from "../app/context/ThemeProvider";

export default function DarkMode() {
    const { isDarkMode, toggleTheme } = useTheme();

    return(
        <button className="p-1.5 border rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-white" onClick={toggleTheme}><MoonIcon/></button>
    )
}