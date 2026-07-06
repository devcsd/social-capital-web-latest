/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1f4fe5",
        "primary-hover": "#191B42",
        highlight: "#191B42",
        secondary: "#ffc404",
        "secondary-hover": "#fcc230",
        "bg-card": "#ffffff",
        "bg-section": "#f9fafb",
        success: "#10b981",
        error: "#ef4444",
        resume: "#4C8DF6",
        resumeText: "#1E40AF",
        pause: "#F59E0B",
        pauseText: "#92400E",
      },
    },
  },
  plugins: [],
};
