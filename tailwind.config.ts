import type { Config } from "tailwindcss";

const config: Config = {
<<<<<<< HEAD
  darkMode: ["class"],
=======
>>>>>>> codex/generate-next.js-project-structure-for-praxis
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
<<<<<<< HEAD
    "./dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./forms/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
=======
>>>>>>> codex/generate-next.js-project-structure-for-praxis
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        bg: "#0B0F14",
        panel: "#101722",
        muted: "#8A95A8",
        accent: "#5B8CFF",
        accentViolet: "#8B5CF6",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.35)",
        glow: "0 0 0 1px rgba(91,140,255,.3), 0 0 20px rgba(91,140,255,.25)",
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        pulseSlow: "pulseSlow 2.8s ease-in-out infinite",
        fadeIn: "fadeIn .3s ease-in-out",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSlow: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
=======
        brand: "#2A63F6",
>>>>>>> codex/generate-next.js-project-structure-for-praxis
      },
    },
  },
  plugins: [],
};

export default config;
