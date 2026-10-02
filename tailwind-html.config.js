/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./html-dist/**/*.html",
    "./html-dist/assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        accent: "var(--color-accent)",
      }
    },
  },
  plugins: [],
}
