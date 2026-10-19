import type { MDXComponents } from "mdx/types";
import { Figure, Gallery, Lane, Note, Pipeline, Stage } from "@/components/post-ui";

const components: MDXComponents = { Pipeline, Lane, Stage, Note, Figure, Gallery };

export function useMDXComponents(): MDXComponents {
  return components;
}
