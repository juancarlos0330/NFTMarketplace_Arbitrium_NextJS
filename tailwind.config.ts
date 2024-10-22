import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      stroke: {},
      fontFamily: {
        inter: ["Anta", "sans-serif"],
        sans: [`"Exo 2"`, "sans-serif"],
      },
      colors: {
        beige: "#B8A48C",
        phase: "#A0FF56",
        apytext: "#FF9518",
        amtext: "#FFC700",
        succ: "#48FF2B",
        fail: "#FF2B2B",
      },
      borderColor: {
        ghost: "#57461B",
        "line-gradient":
          "linear-gradient(90deg, rgba(74, 48, 24, 0.50) 8.85%, #61461E 53.65%, rgba(74, 51, 24, 0.50) 89.06%)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "line-gradient":
          "linear-gradient(90deg, rgba(74, 48, 24, 0.50) 8.85%, #61461E 53.65%, rgba(74, 51, 24, 0.50) 89.06%)",
        "black-gradient":
          "linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, #D9D9D9 52%, rgba(0, 0, 0, 0.00) 100%)",
        "yellow-gradient":
          "linear-gradient(90deg, #FF9432 0.13%, #D8541C 99.88%)",
        "dark-yellow": "rgba(147, 121, 98, 0.04)",
        "orange-gradient":
          "linear-gradient(90deg, #FF9432 0.13%, #D8541C 99.88%)",
        "orange-form": "rgba(147, 115, 98, 0.10)",
        "green-gradient":
          "linear-gradient(90deg, #89E469 0.13%, #095303 99.88%)",
      },
    },
  },
  plugins: [],
};
export default config;
