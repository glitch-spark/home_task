import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff5a00",
          hover: "#e65100",
          foreground: "#c2410c",
          light: "#fff4ed",
          muted: "#ffe8d9",
          ring: "#ff5a0040",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)",
        brand: "0 4px 14px -2px rgb(255 90 0 / 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
