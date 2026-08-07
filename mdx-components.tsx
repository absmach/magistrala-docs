import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Mermaid } from "@/components/mdx/mermaid";
import { assetPath } from "@/lib/base-path";

const DefaultImage = defaultMdxComponents.img as
  | ((props: ComponentPropsWithoutRef<"img">) => ReactNode)
  | undefined;

// Doc content images (content/docs/img, content/docs/diagrams,
// public/screenshots) are resolved by lib/remark-doc-images.ts at compile
// time into a literal "/docs/magistrala/{img,diagrams,screenshots}/..."
// URL -- that fixed prefix (not the edition-aware assetPath() used below)
// is what workers/image-proxy.ts actually routes on, since doc images are
// shared between the Community and Enterprise editions. Anything already
// carrying that prefix is rendered directly as a plain, zoomable <img> (no
// next/image, no width/height needed); everything else keeps going through
// the pre-existing assetPath()-prefixed next/image path unchanged.
const DOC_IMAGE_PATTERN = /^\/docs\/magistrala\/(img|diagrams|screenshots)\//;

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => {
      if (typeof props.src === "string" && DOC_IMAGE_PATTERN.test(props.src)) {
        const { src, alt, ...rest } = props;
        return (
          // src/alt passed here too, not just to the inner <img>: ImageZoom's
          // zoomed-in view reads its image from these props directly, not
          // from `children` -- omitting them renders a blank zoomed-in image
          // even though the inline thumbnail (via children) looks correct.
          <ImageZoom src={src} alt={alt ?? ""}>
            {/* biome-ignore lint/performance/noImgElement: doc content images are served from R2, not Next's image pipeline -- see lib/remark-doc-images.ts */}
            <img
              {...rest}
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              className="rounded-lg"
            />
          </ImageZoom>
        );
      }

      const src =
        typeof props.src === "string" ? assetPath(props.src) : props.src;

      if (DefaultImage) return <DefaultImage {...props} src={src} />;
      return null;
    },
    Mermaid,
    ...components,
  };
}
