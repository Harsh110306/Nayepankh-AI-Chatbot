export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E65100",
          orangeLight: "#FFF3E0",
          green: "#2E7D32",
          greenLight: "#E8F5E9",
          teal: "#00695C",
          darkBg: "#121212",
          darkCard: "#1E1E1E",
          darkBorder: "#2E2E2E"
        }
      }
    }
  },
  darkMode: "class",
  plugins: []
}
