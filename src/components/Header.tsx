import DarkMode from "./DarkMode";

export default function Header(){
    return(
        <header className="inline-flex justify-between items-center w-full pt-4">
            <img src="https://res.cloudinary.com/diruiumfk/image/upload/v1736373588/impuestAR_yz7khk.svg" className="w-[125px]" alt="impuestAR logo" />
            <DarkMode/>
        </header>
    )
}