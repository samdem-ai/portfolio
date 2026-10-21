import type { MDXComponents } from "mdx/types";
import React from "react";
import { Figure, Gallery, Lane, Note, Pipeline, Stage } from "@/components/post-ui";
import { slugify } from "@/lib/toc";

/** Flatten a heading's children to plain text so the id matches the TOC slug. */
function textOf(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((c) =>
      typeof c === "string" || typeof c === "number"
        ? String(c)
        : React.isValidElement(c)
          ? textOf((c.props as { children?: React.ReactNode }).children)
          : "",
    )
    .join("");
}

const heading = (Tag: "h2" | "h3") =>
  function Heading(props: React.ComponentProps<"h2">) {
    return <Tag id={slugify(textOf(props.children))} {...props} />;
  };

const components: MDXComponents = {
  Pipeline,
  Lane,
  Stage,
  Note,
  Figure,
  Gallery,
  h2: heading("h2"),
  h3: heading("h3"),
  // Long tables (URLs, hashes) scroll sideways instead of blowing out the page on mobile.
  table: (props: React.ComponentProps<"table">) => (
    <div className="-mx-1 overflow-x-auto px-1">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
