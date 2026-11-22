/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "rgb(var(--cream) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        stone: "rgb(var(--stone) / <alpha-value>)",
        leaf: { DEFAULT: "rgb(var(--leaf) / <alpha-value>)", deep: "rgb(var(--leaf-deep) / <alpha-value>)", soft: "rgb(var(--leaf-soft) / <alpha-value>)" },
        blush: { DEFAULT: "rgb(var(--blush) / <alpha-value>)", deep: "rgb(var(--blush-deep) / <alpha-value>)", soft: "rgb(var(--blush-soft) / <alpha-value>)" },
        butter: { DEFAULT: "rgb(var(--butter) / <alpha-value>)", soft: "rgb(var(--butter-soft) / <alpha-value>)" },
        mint: { soft: "rgb(var(--mint-soft) / <alpha-value>)" },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      boxShadow: { card: "0 1px 2px rgba(26,42,32,.06), 0 10px 30px -14px rgba(26,42,32,.25)" },
      keyframes: { floaty: { "0%,100%": { transform: "translateY(0) rotate(var(--r,0deg))" }, "50%": { transform: "translateY(-8px) rotate(var(--r,0deg))" } } },
      animation: { floaty: "floaty 5s ease-in-out infinite" },
    },
  },
  plugins: [],
};
