module.exports = {
  root: true,
  extends: [
    "expo",
    "@react-native",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-native",
    "unused-imports",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Unused code detection rules
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-unused-vars": "off", // Turn off base rule as it can report incorrect errors
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // React specific unused code rules
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React Native specific
    "react-native/no-unused-styles": "error",
    "react-native/split-platform-components": "error",
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "warn",

    // General code quality
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",

    // React rules
    "react/prop-types": "off", // We use TypeScript
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/display-name": "off",

    // Console and debugging
    "no-console": "warn",
    "no-debugger": "error",

    // Import organization
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
  },
  env: {
    "react-native/react-native": true,
    es6: true,
    node: true,
  },
  ignorePatterns: [
    "node_modules/",
    "android/",
    "ios/",
    ".expo/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.ts",
  ],
};
