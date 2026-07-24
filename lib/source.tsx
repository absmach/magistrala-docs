import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader, type Source } from "fumadocs-core/source";
import { NewBadge } from "@/components/mdx/new-badge";
import { CURRENT_EDITION } from "@/lib/edition";

function dirOf(path: string) {
  return path.split("/").slice(0, -1).join("/");
}

function join(dir: string, name: string) {
  return dir ? `${dir}/${name}` : name;
}

// Excludes any file/folder flagged `enterprise: true` (see source.config.ts)
// from the Community Edition build, along with dangling references to them
// in parent `meta.json` `pages` arrays. Everything downstream — the sidebar
// tree, static params, sitemap, search index, and llms-full.txt — reads
// through this one filtered source, so this is the single place edition
// gating needs to happen.
function filterForEdition<T extends Source>(source: T): T {
  if (CURRENT_EDITION !== "community") return source;

  const gatedDirs = source.files
    .filter(
      (file) =>
        file.type === "meta" &&
        (file.data as { enterprise?: boolean }).enterprise,
    )
    .map((file) => file.path.replace(/meta\.json$/, ""));

  const isGated = (file: (typeof source.files)[number]) => {
    if (gatedDirs.some((dir) => file.path.startsWith(dir))) return true;
    if (
      file.type === "page" &&
      (file.data as { enterprise?: boolean }).enterprise
    )
      return true;
    return false;
  };

  const kept = source.files.filter((file) => !isGated(file));
  const keptPaths = new Set(kept.map((file) => file.path));

  const files = kept.map((file) => {
    const pages = (file.data as { pages?: string[] }).pages;
    if (file.type !== "meta" || !Array.isArray(pages)) return file;

    const dir = dirOf(file.path);
    const filteredPages = pages.filter(
      (name) =>
        keptPaths.has(join(dir, `${name}/meta.json`)) ||
        keptPaths.has(join(dir, `${name}.mdx`)),
    );

    return { ...file, data: { ...file.data, pages: filteredPages } };
  });

  return { ...source, files } as T;
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/",
  source: filterForEdition(docs.toFumadocsSource()),
  plugins: [],
  pageTree: {
    transformers: [
      {
        file(node, filePath) {
          const file = filePath ? this.storage.read(filePath) : undefined;
          if (file?.format === "page" && file.data.new) {
            return {
              ...node,
              name: (
                <span
                  key={node.$id ?? "new-badge-wrapper"}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <span key="label">{node.name}</span>
                  <NewBadge key="badge" />
                </span>
              ),
            };
          }
          return node;
        },
      },
    ],
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.webp"];
  return {
    segments,
    url: `/og/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
