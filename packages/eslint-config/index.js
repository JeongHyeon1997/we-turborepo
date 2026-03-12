module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["react", "react-hooks", "react-native", "@typescript-eslint"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
