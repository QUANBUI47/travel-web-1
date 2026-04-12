import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    light: {
      colors: {
        background: "#FFFFFF", // Expedia style: Clean white
        foreground: "#1A1A1A", // Near black for contrast
        primary: {
          50: "#e6f0f9",
          100: "#cce1f3",
          200: "#99c3e7",
          300: "#66a5db",
          400: "#3387cf",
          500: "#0068c3", // Expedia Blue (approx)
          600: "#00539c",
          700: "#003e75",
          800: "#002a4e",
          900: "#001527",
          DEFAULT: "#0068c3",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#fff9e6",
          100: "#fff3cc",
          200: "#ffe799",
          300: "#ffdb66",
          400: "#ffcf33",
          500: "#fcc219", // Expedia Yellow (highlight)
          600: "#ca9b14",
          DEFAULT: "#fcc219",
          foreground: "#1A1A1A",
        },
        focus: "#0068c3",
      },
      layout: {
        radius: {
          small: "6px",
          medium: "10px",
          large: "14px",
        },
        borderWidth: {
          small: "1px",
          medium: "1.5px",
          large: "2px",
        },
      },
    },
    dark: {
      colors: {
        background: "#0D1117",
        foreground: "#F0F6FC",
        primary: {
          50: "#0d2136",
          100: "#1a426d",
          200: "#2664a3",
          300: "#3385da",
          400: "#5ba2e1",
          500: "#82bff0",
          DEFAULT: "#3385da",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#fcc219",
          foreground: "#0D1117",
        },
        focus: "#3385da",
      },
    },
  },
});
