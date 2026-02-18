module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          200: "#052e0f",
          800: "#509872",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
        },
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(8, 47, 73, 0.35)",
      },
    },
  },
  plugins: [],
};
