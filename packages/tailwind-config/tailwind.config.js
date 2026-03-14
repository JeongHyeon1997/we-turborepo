/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        /** 타이틀, 버튼, 탭 레이블 등 UI 텍스트 */
        jua: ['BMJUA', 'sans-serif'],
        /** 본문, 일기, 리스트, 커뮤니티 콘텐츠 */
        hanna: ['BMHANNAPro', 'sans-serif'],
      },
      keyframes: {
        heartBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%':      { transform: 'scale(1.4)' },
          '60%':      { transform: 'scale(0.9)' },
        },
      },
      animation: {
        'heart-bounce': 'heartBounce 0.4s ease',
      },
    },
  },
  plugins: [],
};
