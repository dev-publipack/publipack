import type { Config } from 'tailwindcss';

/**
 * Tailwind Configuration for Publipacks V2
 *
 * Based on new design specification
 * @see docs/DESIGN_SPEC.md - Section 2
 */
const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.html',
  ],
  safelist: [],
  theme: {
    extend: {
      colors: {
        // Main background and accents
        'bg-primary': '#8FCCEA',
        accent: '#72C2F0',
        stroke: '#BDE2F4',

        // Pink shades
        'pink-light': '#FFD7EB',
        'pink-bright': '#FFA2DC',

        // Orange shades
        cream: '#FFEDD9',
        orange: '#FF8B00',
        'orange-light': '#FFE7CA',

        // Green shades (buttons)
        'green-button': '#AEFB8B',
        'green-stroke': '#DCF7CD',

        // Blue shades
        'blue-text': '#BBE3F2',
        'blue-dark': '#2066BB',

        // Gray shades
        'gray-light': '#F2EBEE',
        'gray-placeholder': '#B3B3B3',
      },

      backgroundImage: {
        // Gradients from design spec
        'popup-gradient':
          'radial-gradient(circle at 50% 50%, #FFF7FB 0%, #FFA2DC 100%)',
        'machine-gradient':
          'radial-gradient(circle at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)',
        'chain-gradient':
          'radial-gradient(circle at 50% 50%, #FFE7CA 35%, #FF8B00 100%)',
        'light-on':
          'radial-gradient(circle at 37% 35%, #FFF6EB 0%, #FFC981 25%, #FFA827 50%, #D98625 100%)',
      },

      fontFamily: {
        bungee: ['Bungee', 'cursive'],
        roboto: ['Roboto', 'sans-serif'],
      },

      fontSize: {
        'pill-title': ['2.5rem', { lineHeight: '1.2' }],
      },

      boxShadow: {
        // Custom shadows from design
        header: '0px 0px 10px 5px rgba(255, 255, 255, 0.85)',
        machine:
          '0px 0px 10px 5px rgba(255, 255, 255, 0.85), inset 0px 0px 20px 5px rgba(255, 255, 255, 0.85)',
        button: '0px 0px 5px 1px rgba(0, 0, 0, 0.25)',
        'light-glow':
          '0px 0px 10px rgba(255, 227, 194, 0.55), 0px 0px 20px rgba(255, 176, 81, 0.4)',
        vector: '0px 0px 20px rgba(189, 226, 244, 1)',
      },

      dropShadow: {
        text: '0px 0px 5px rgba(0, 0, 0, 0.25)',
      },

      animation: {
        'spin-slow': 'spin 3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'pulse-light': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'lantern-pulse': 'lanternPulse 1.5s ease-in-out infinite',
      },

      keyframes: {
        lanternPulse: {
          '0%, 100%': {
            boxShadow:
              '0 0 10px 3px rgba(255,227,194,0.5), 0 0 18px 6px rgba(255,176,81,0.35)',
          },
          '50%': {
            boxShadow:
              '0 0 16px 6px rgba(255,227,194,0.7), 0 0 28px 10px rgba(255,176,81,0.55)',
          },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    // Figma pill header text: Bungee 40px, blue fill, blue-dark stroke, text shadow
    function ({ addUtilities }: { addUtilities: (u: object) => void }) {
      addUtilities({
        '.font-pill-title': {
          fontFamily: 'Bungee, cursive',
          fontSize: '2.5rem',
          lineHeight: '1.2',
          color: '#BBE3F2',
          WebkitTextStroke: '2px #2066BB',
          textShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
        },
      });
    },
  ],
};

export default config;
