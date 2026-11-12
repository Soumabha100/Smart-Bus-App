/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#0B1220",
          surface: "#0C1321",
          low: "#151B2A",
          container: "#19202E",
          high: "#232A39",
          highest: "#2E3544",
        },
        cream: {
          DEFAULT: "#FFF7ED",
          light: "#FFFDF9",
          muted: "#DFC0B8",
        },
        coral: {
          DEFAULT: "#FF7A59",
          hover: "#E06547",
          light: "#FFB4A2",
          subtle: "#FFDAD2",
        },
        teal: {
          DEFAULT: "#2DD4BF",
          glow: "#44E2CD",
          dark: "#004D44",
          light: "#62FAE3",
        },
        // Time themes
        theme: {
          morning: {
            peach: "#FDBA74",
            gold: "#F59E0B",
          },
          evening: {
            violet: "#8B5CF6",
            deep: "#1E1B4B",
          },
          night: {
            navy: "#0B1220",
            teal: "#2DD4BF",
          },
        },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "24": "24px",
        pill: "9999px",
      },
      minHeight: {
        tap: "48px",
      },
      minWidth: {
        tap: "48px",
      },
    },
  },
  plugins: [],
}
