// tailwind.config.mjs :

import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 1. Content scanning
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./content/**/*.{md,mdx}", // Markdown-bestanden in je contentmap
    "!**/.cache/**",
    "!**/public/**",
    "!**/dist/**",
    "!**/.netlify/**",
    "!**/supabase/**",
    "!**/.git/**",
    "!**/.vscode/**",
    "!**/.idea/**",
    "!**/coverage/**",
  ],

  theme: {
    // 2. Thema aanpassingen
    extend: {
      // 3. Thema uitbreidingen
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"], // Gebruik de CSS-variabele
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        blue: {
          300: "#93C5FD", // Aanpassen voor focus-states
          500: "#1D4ED8", // Vervang de standaard 'blue-500'
          600: "#1E40AF", // Aanpassen voor hover-states
        },
        rose: {
          400: "#D36E70", // oud roze
        },
      },
      //     spacing: {
      //       72: "18rem", // Extra spacing-opties (nog niet in gebruik)
      //     },
    },
  },

  variants: {
    // 4. Variant configuratie
    extend: {
      backgroundColor: ["active"], // Actieve achtergrondkleur mogelijk maken (nog niet in gebruik)
      textColor: ["visited"], // Tekstkleur bij bezochte links (nog niet in gebruik)
    },
  },

  plugins: [
    // 5. Extra plugins
    forms, // Formulier-styling (nog niet in gebruik)
    typography, // Rich text-styling (nog niet in gebruik)
  ],
};
