/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mint: "#08D9D6",
        dark: "#252A34",
        pink: "#FF2E63",
        gray: "eaeaea",
        lavender: "#E0E7FF",
        navy: "#23395D",
        lightblue: "#C7D2FE",
        lightgray: "#6B7280",
      },
      boxShadow: {
        inset: "inset 0 2px 4px rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [],
};
