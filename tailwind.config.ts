import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
				"2xl": { max: "1535px" },
				// => @media (max-width: 1535px) { ... }
		  
				xl: { max: "1279px" },
				// => @media (max-width: 1279px) { ... }
		  
				lg: { max: "1023px" },
				// => @media (max-width: 1023px) { ... }
		  
				md: { max: "767px" },
				// => @media (max-width: 767px) { ... }
		  
				sm: { max: "639px" },
				// => @media (max-width: 639px) { ... }
		  
				xs: { max: "430px" },
				// => @media (max-width: 430px) { ... }

        xxs: { max: "240px" },
				// => @media (max-width: 240px) { ... }
			  },
        
    },
  },
  plugins: [],
} satisfies Config;
