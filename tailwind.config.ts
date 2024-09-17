import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/page/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3B82F6",
                paper: "#F9FAFB",
                white: "#ffffff",
                inputLabel: "#374151",
                secondary: "#9CA3AF",
            },
        },
    },
    plugins: [],
};
export default config;
