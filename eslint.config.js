import { defineConfig } from "eslint/config";
import vue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.vue"],
    ignores: [".github", "dist"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tseslint,
    },
    settings: {},
    rules: {
      curly: "error",
      eqeqeq: "error",
      "object-shorthand": "error",
      "prefer-const": "error",
    },
  },
  prettier,
]);
