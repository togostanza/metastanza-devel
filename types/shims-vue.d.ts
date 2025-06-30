// This declaration file allows TypeScript to understand .vue files as modules.
// It enables importing Vue components in TypeScript files without type errors.

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default component;
}
