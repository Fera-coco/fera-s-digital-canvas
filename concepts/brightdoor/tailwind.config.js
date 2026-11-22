/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F6F1E7",
        paper: "#FFFDF8",
        sand: "#EADFCB",
        ink: "#1B211E",
        stone: "#6B6A63",
        forest: { DEFAULT: "#1F4D3A", deep: "#143327", soft: "#DCE8DF" },
        clay: { DEFAULT: "#D2603A", soft: "#F7DDD1", ink: "#A5431F" },
        gold: { DEFAULT: "#E7AE45", soft: "#FBEBC8" },
        lagoon: "#BFD9DA",
      },
      fontFamily: {
        display: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
      boxShadow: { card: "0 1px 2px rgba(27,33,30,.06), 0 8px 24px -12px rgba(27,33,30,.18)" },
    },
  },
  plugins: [],
};
