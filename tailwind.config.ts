import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F0E8",
        surface: "#FFFFFF",
        "surface-alt": "#EDE8DC",
        "text-primary": "#1A1A2E",
        "text-secondary": "#4A4A6A",
        "text-muted": "#8A8AA8",
        accent: "#C1440E",
        "accent-hover": "#A3360B",
        "accent-light": "#F5E6DF",
        success: "#2D6A4F",
        warning: "#E9C46A",
        border: "#D8D2C4",
        shadow: "rgba(26,26,46,0.08)",
        error: "#B91C1C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "16px",
        button: "10px",
        input: "10px",
      },
      spacing: {
        "section-padding": "80px",
      },
      boxShadow: {
        card: "0 2px 16px rgba(26,26,46,0.07), 0 1px 3px rgba(26,26,46,0.05)",
        "card-hover":
          "0 8px 32px rgba(26,26,46,0.12), 0 2px 8px rgba(26,26,46,0.08)",
        button: "0 2px 8px rgba(193,68,14,0.25)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-out",
      },
      keyframes: {
        "fade-slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-slide-up": "fade-slide-up 200ms ease-out forwards",
        "progress-fill": "progress-fill 400ms ease-out forwards",
        spin: "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
