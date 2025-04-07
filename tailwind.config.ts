import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable dark mode using the `class` strategy
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Adjust this path to match your project structure
  ],
  theme: {
    colors: {
      primary: "#03263E",
      secondary: "#27AAE1",
      skyblue: "#27AAE1",
      lightGreen: "#39EC35",
      yellow: "#FFCA0F",
      lightgrey: "#2CC6A1",
      dark: "#121212",
      darkText: "#F8FAFC", // Light text for dark mode
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;