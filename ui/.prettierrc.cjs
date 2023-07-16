/** @type {import("prettier").Options} */
module.exports = {
  arrowParens: "avoid",
  bracketSpacing: true,
  endOfLine: "lf",
  importOrder: [
    "^next(.*)",
    "^react(.*)",
    "^react-dom(.*)",
    "<THIRD_PARTY_MODULES>",
    "@/(.*)",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  jsxSingleQuote: false,
  quoteProps: "consistent",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  plugins: [
    require("@trivago/prettier-plugin-sort-imports"),
    require("prettier-plugin-tailwindcss"),
  ],
};
