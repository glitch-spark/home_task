import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff5a00",
          hover: "#e65100",
          light: "#fff4ed",
          ring: "#ff5a0040",
        },
      },
    },
  },
  plugins: [],
};

export default config;
