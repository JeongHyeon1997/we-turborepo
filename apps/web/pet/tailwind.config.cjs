const sharedConfig = require('@we/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../../packages/ui-web/src/**/*.{ts,tsx}',
  ],
};
