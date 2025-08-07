import { defineConfig } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";

const commonGlobals = {
  window: "readonly",
  document: "readonly",
};

const commonRules = {
  curly: "error",
  eqeqeq: "error",
  "object-shorthand": "error",
  "prefer-const": "error",
  "@typescript-eslint/ban-types": "off",
};

export default defineConfig([
  {
    ignores: [".github", "dist"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tsParser,
      globals: commonGlobals,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: commonRules,
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
      globals: commonGlobals,
    },
    plugins: {
      pluginVue,
      "@typescript-eslint": tseslint,
    },
    rules: commonRules,
  },
  prettier,
]);
