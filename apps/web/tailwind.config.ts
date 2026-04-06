import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bp: {
          bg: '#0a0a0f',
          surface: '#12121a',
          border: '#1e1e2e',
          purple: '#6c63ff',
          cyan: '#00e5ff',
          green: '#00e676',
          amber: '#ffb300',
          red: '#ff5252',
          text: '#ffffff',
          'text-sec': '#a0a0b0',
          'text-dim': '#606070',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #6c63ff 0%, #9b5de5 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #00e5ff 0%, #6c63ff 100%)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'purple-glow': '0 0 30px rgba(108,99,255,0.3)',
        'cyan-glow': '0 0 30px rgba(0,229,255,0.2)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
