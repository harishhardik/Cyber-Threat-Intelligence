/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soc: {
          bg: "#0F172A",
          sidebar: "#111827",
          card: "#1E293B",
          primary: "#2563EB",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          text: "#FFFFFF",
          secondary: "#94A3B8",
          border: "#334155", // slate-700
          accent: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
