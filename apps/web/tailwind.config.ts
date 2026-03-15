import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0f0f23',
          surface: '#1a1a3e',
          purple: '#2d1b69',
          'purple-light': '#4a2d8a',
          green: '#00ff88',
          red: '#ff6b6b',
          yellow: '#ffe66d',
          teal: '#4ecdc4',
          white: '#e0e0e0',
          muted: '#888899',
        },
        terminal: {
          bg: '#0a0a1a',
          text: '#00ff88',
          prompt: '#666688',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%)',
        'surface-gradient': 'linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
