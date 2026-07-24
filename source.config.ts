import { remarkAdmonition } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // `new: true` marks a page as recently added; rendered as a "New" badge
    // in the sidebar and next to the page title (see lib/source.ts, app/[[...slug]]/page.tsx)
    schema: pageSchema.extend({
      new: z.boolean().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        "bash",
        "go",
        "javascript",
        "json",
        "lua",
        "python",
        "toml",
        "typescript",
        "yaml",
      ],
    },
    remarkPlugins: [remarkAdmonition],
  },
});
