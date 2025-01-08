"use client"
import MoonIcon from "@/icons/MoonIcon";

export default function DarkMode() {

    if (localStorage.getItem('colorTheme') === 'dark' || (!('colorTheme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark')
    }

    return(
        <button className="p-1.5 border rounded-lg cursor-pointer hover:bg-neutral-100"><MoonIcon/></button>
    )
}