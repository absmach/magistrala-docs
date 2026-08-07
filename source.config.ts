import { remarkAdmonition } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";
import { remarkDocImages } from "./lib/remark-doc-images";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // `new: true` marks a page as recently added; rendered as a "New" badge
    // in the sidebar and next to the page title (see lib/source.ts, app/[[...slug]]/page.tsx)
    // `enterprise: true` marks a page as Enterprise Edition only; filtered out
    // of the Community Edition build (see lib/edition.ts, lib/source.tsx)
    schema: pageSchema.extend({
      new: z.boolean().optional(),
      enterprise: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    // `enterprise: true` marks a whole folder (and its descendants) as
    // Enterprise Edition only; filtered out of the Community Edition build
    schema: metaSchema.extend({
      enterprise: z.boolean().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    // Doc images are served from R2 via a same-origin proxy route (see
    // workers/image-proxy.ts) rather than committed to content/docs/img,
    // content/docs/diagrams, or public/screenshots and bundled by
    // next/image. The default remark-image plugin needs the source file on
    // local disk (either to import it as a static asset, or just to probe
    // its dimensions) -- disabling it keeps markdown image syntax
    // (`![alt](../img/x.png)`) completely unchanged for authors; the actual
    // path resolution happens in remarkDocImages below instead, and
    // rendering happens through mdx-components.tsx's plain `img:` override
    // (a plain <img>, no next/image, no dimensions needed).
    remarkImageOptions: false,
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: ["lua", "typescript", "bash", "javascript", "go"],
    },
    remarkPlugins: [remarkAdmonition, remarkDocImages],
  },
});
