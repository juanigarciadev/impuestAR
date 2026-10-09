import DarkMode from "./DarkMode";
import Link from "next/link";

export default function Header(){
    return(
        <header className="flex justify-between items-center w-full pt-6">
            <Link href="/" aria-label="impuestAR, ir al inicio">
                <img src="https://res.cloudinary.com/diruiumfk/image/upload/v1736373588/impuestAR_yz7khk.svg" className="w-[125px] dark:hidden" alt="impuestAR logo" />
                <img src="https://res.cloudinary.com/diruiumfk/image/upload/v1736374885/impuestAR-white_va9bq8.svg" className="w-[125px] hidden dark:block" alt="impuestAR logo" />
            </Link>
            <DarkMode/>
        </header>
    )
}
