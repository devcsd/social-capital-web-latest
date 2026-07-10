/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---------- Existing tokens (unchanged — kept for backward compatibility) ----------
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

        // ---------- New tokens — reference design-language scale ----------
        // Blue scale (brand)
        "sc-blue": {
          900: "#0a1f6b",
          700: "#1b3fc4",
          600: "#1e4fe5",
          500: "#4072ff",
          100: "#e6ecff",
        },
        // Gold scale (accent)
        "sc-gold": {
          600: "#e8a90b",
          500: "#ffc72c",
          300: "#ffe089",
        },
        // Ink / dark-surface scale (cards, panels)
        "sc-ink": {
          900: "#0b1233",
          800: "#111a44",
          700: "#1a2560",
        },
        // Text-on-blue helpers
        "sc-text": "#ffffff",
        "sc-text-dim": "rgba(255,255,255,0.72)",
        "sc-text-mute": "rgba(255,255,255,0.55)",

        // Status / accent
        "sc-green": "#34d399",
        "sc-pink": "#f472b6",
        "sc-violet": "#a78bfa",

        // Line / hairline helpers
        "sc-line": "rgba(255,255,255,0.08)",
        "sc-line-strong": "rgba(255,255,255,0.16)",
      },

      borderRadius: {
        "sc-sm": "10px",
        "sc-md": "16px",
        "sc-lg": "24px",
        "sc-xl": "32px",
      },

      boxShadow: {
        "sc-card":
          "0 20px 50px -20px rgba(4, 10, 40, 0.6), 0 2px 0 rgba(255,255,255,0.04) inset",
      },

      fontFamily: {
        // Headings / display type
        display: [
          "Inter Tight",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        // Body copy (kept distinct from `font-inter` utility already in index.css)
        "sc-body": ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        // Mono — used for eyebrows, labels, tags, stat/mono numbers
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SF Mono",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};