import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./forms/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg0: "rgb(var(--bg-0))",
        bg1: "rgb(var(--bg-1))",
        bg2: "rgb(var(--bg-2))",
        text0: "rgb(var(--text-0))",
        text1: "rgb(var(--text-1))",
        text2: "rgb(var(--text-2))",
        acc0: "rgb(var(--acc-0))",
        acc1: "rgb(var(--acc-1))",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.3)",
        glow: "0 0 0 2px rgba(110,168,255,.18), 0 0 24px rgba(110,168,255,.2)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 260ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
