import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react: react,
      "react-hooks": reactHooks,
      "react-native": reactNative,
      "unused-imports": unusedImports,
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
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: [
      "node_modules/",
      "android/",
      "ios/",
      ".expo/",
      "dist/",
      "build/",
      "*.config.js",
      "*.config.ts",
      "coverage/",
      ".nyc_output/",
    ],
  },
];
