/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  // DaisyUI configuration
  daisyui: {
    // These themes will automatically switch based on user's system preference
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#ff6b35",
          "primary-focus": "#e85c1f",
          secondary: "#4ecdc4",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#ff6b35",
          "primary-focus": "#e85c1f",
          secondary: "#4ecdc4",
        },
      },
    ],
  },
};
