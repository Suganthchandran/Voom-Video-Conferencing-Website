import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			dark: {
				1: '#1C1F2E',
				2: '#161925',
			},
			blue: {
				1: '#0E78F9',
			},
			sky: {
				1: '#C9DDFF',
			}
		},
		backgroundImage: {
			hero: "url('/images/hero-background.png')"
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
