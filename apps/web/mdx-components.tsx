import type { MDXComponents } from "mdx/types";
import SaintLink from "@/components/saints/saint-link";
import MdxFigure from "@/components/mdx-figure";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    SaintLink,
    Figure: MdxFigure,
    ...components,
  };
}