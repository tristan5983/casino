module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f0f1e',
        'dark-card': '#1a1a2e',
        'dark-input': '#16213e',
        'neon-purple': '#a855f7',
        'neon-cyan': '#06b6d4',
        'neon-green': '#22c55e',
        'neon-pink': '#ec4899'
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px currentColor' },
          '50%': { textShadow: '0 0 20px currentColor' }
        }
      },
      animation: {
        spin: 'spin 0.6s linear',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
