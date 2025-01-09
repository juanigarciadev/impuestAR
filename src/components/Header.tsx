"use client"
import { useTheme } from "@/app/context/ThemeProvider";
import DarkMode from "./DarkMode";
import Link from "next/link";

export default function Header(){
    const { isDarkMode, toggleTheme } = useTheme();
    return(
        <header className="inline-flex justify-between items-center w-full pt-6">
            {isDarkMode ? <Link href={'/'}><img src="https://res.cloudinary.com/diruiumfk/image/upload/v1736374885/impuestAR-white_va9bq8.svg" className="w-[125px]" alt="impuestAR logo" /></Link>  : <Link href={'/'}><img src="https://res.cloudinary.com/diruiumfk/image/upload/v1736373588/impuestAR_yz7khk.svg" className="w-[125px]" alt="impuestAR logo" /></Link>}
            <DarkMode/>
        </header>
    )
}