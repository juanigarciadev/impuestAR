import CoffeeIcon from "@/icons/CoffeeIcon";
import GithubIcon from "@/icons/GithubIcon";
import SendIcon from "@/icons/SendIcon";

export default function Footer() {
    return(
        <footer className="inline-flex gap-2 items-center justify-center w-full h-20 border border-neutral-300 bg-neutral-100 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
            <a href="https://github.com/juanigarciadev/" target="_blank" className="p-2 border border-neutral-300 rounded-lg duration-200 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:text-white">
                <GithubIcon/>
            </a>
            <a href="https://cafecito.app/juanigarciadev" target="_blank" className="p-2 border border-neutral-300 rounded-lg duration-200 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:text-white">
                <CoffeeIcon/>
            </a>
            <a href="mailto:juanigarciadev@gmail.com" target="_blank" className="p-2 border border-neutral-300 rounded-lg duration-200 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:text-white">
                <SendIcon/>
            </a>
        </footer>
    )
}