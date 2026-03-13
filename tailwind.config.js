/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '840px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          primary: '#0084d1',
          sky: '#00a6f4',
          dark: '#101828',
          light: '#FEFFF6',
        }
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
        mono: ["Pretendard Variable", "Pretendard", "monospace"],
        nanumSquareNeo: ["NanumSquare Neo", "sans-serif"],
      },
    },
  },
  plugins: [],
}
