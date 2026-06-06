declare module "*.mdx" {
  import type { ComponentType } from "react";
  const component: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  export default component;
  export const frontmatter: Record<string, any>;
}