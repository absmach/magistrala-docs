import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Mermaid } from "@/components/mdx/mermaid";
import { assetPath } from "@/lib/base-path";

const DefaultImage = defaultMdxComponents.img as
  | ((props: ComponentPropsWithoutRef<"img">) => ReactNode)
  | undefined;

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => {
      const src =
        typeof props.src === "string" ? assetPath(props.src) : props.src;

      if (DefaultImage) return <DefaultImage {...props} src={src} />;
      return null;
    },
    Mermaid,
    ...components,
  };
}
