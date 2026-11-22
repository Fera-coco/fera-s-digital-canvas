/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EE",
        paper: "#FFFDF9",
        ink: "#1A2A20",
        stone: "#5F6B63",
        leaf: { DEFAULT: "#1E6B3E", deep: "#124A2A", soft: "#DDEFD9" },
        blush: { DEFAULT: "#E0457B", deep: "#B8245A", soft: "#FCE1EA" },
        butter: { DEFAULT: "#F5C842", soft: "#FDF1C7" },
        mint: { soft: "#D7F1EA" },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
      boxShadow: { card: "0 1px 2px rgba(26,42,32,.06), 0 10px 30px -14px rgba(26,42,32,.25)" },
      keyframes: { floaty: { "0%,100%": { transform: "translateY(0) rotate(var(--r,0deg))" }, "50%": { transform: "translateY(-8px) rotate(var(--r,0deg))" } } },
      animation: { floaty: "floaty 5s ease-in-out infinite" },
    },
  },
  plugins: [],
};
