import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: { fontFamily: { sans: ["var(--font-bn)", "system-ui", "sans-serif"] } },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        bazar: {
          primary: "#14532d",
          "primary-content": "#ffffff",
          secondary: "#f2b705",
          "secondary-content": "#1f2937",
          accent: "#b45309",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f5f1",
          "base-300": "#e0e6dc",
          info: "#0369a1",
          success: "#15803d",
          warning: "#f2b705",
          error: "#dc2626",
        },
      },
    ],
  },
};
export default config;
