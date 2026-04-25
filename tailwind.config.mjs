/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,svelte,vue}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cinzel"', "Georgia", "serif"],
        body: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
      },
      colors: {
        night: { DEFAULT: "#0a0b14", 800: "#12132a" },
        gold: {
          200: "#f3e5ab",
          300: "#e4cf87",
          400: "#d4af37",
          500: "#b8962e",
        },
        veil: "rgba(212, 175, 55, 0.08)",
      },
      keyframes: {
        twinkle: { "0%, 100%": { opacity: "0.3" }, "50%": { opacity: "1" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: { twinkle: "twinkle 3s ease-in-out infinite", float: "float 6s ease-in-out infinite" },
    },
  },
  plugins: [],
};
