/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
