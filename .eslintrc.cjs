module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@babel/eslint-parser",
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
