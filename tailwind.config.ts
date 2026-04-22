import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
    "./dashboard/**/*.{js,ts,jsx,tsx,mdx}",
    "./forms/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07090E",
        panel: "#0C1221",
        muted: "#8A95A8",
        accent: "#4488ff",
        accentViolet: "#8B5CF6",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0, 0, 0, 0.5)",
        glow: "0 0 0 1px rgba(68,136,255,0.55), 0 0 20px rgba(68,136,255,0.4), 0 0 48px rgba(68,136,255,0.15)",
        "glow-sm": "0 0 0 1px rgba(68,136,255,0.4), 0 0 8px rgba(68,136,255,0.28)",
        "glow-strong": "0 0 0 1px rgba(68,136,255,0.8), 0 0 32px rgba(68,136,255,0.55), 0 0 72px rgba(68,136,255,0.22)",
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        pulseSlow: "pulseSlow 2.8s ease-in-out infinite",
        fadeIn: "fadeIn .3s ease-in-out",
        glowPulse: "glowPulse 2s ease-in-out infinite",
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
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 0 1px rgba(68,136,255,0.4), 0 0 12px rgba(68,136,255,0.25)" },
          "50%": { boxShadow: "0 0 0 1px rgba(68,136,255,0.7), 0 0 24px rgba(68,136,255,0.5), 0 0 48px rgba(68,136,255,0.18)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
