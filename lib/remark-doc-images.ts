import { dirname, join, normalize, relative } from "node:path";

// Minimal structural types for what this plugin touches -- avoids pulling in
// `@types/mdast`/`vfile` as direct dependencies for two fields.
interface MdastNode {
  type?: string;
  url?: string;
  children?: MdastNode[];
}
interface CompileFile {
  path: string;
}

// Doc content images live in the shared R2 bucket (see workers/image-proxy.ts)
// instead of content/docs/img, content/docs/diagrams, or public/screenshots.
// Authors keep writing plain markdown image syntax with the same paths they
// always used -- this plugin rewrites each image's `url` at compile time
// (pure path math, no image bytes needed) into the literal
// "/docs/magistrala/{img,diagrams,screenshots}/..." URL the Worker serves,
// so nothing about the authoring experience changes.
//
// - Relative paths ("../img/x.png", "../../diagrams/x.svg") resolve against
//   the source .mdx file's own location, same as markdown always works.
// - Absolute paths starting with "/screenshots/..." (public/ convention)
//   just get the fixed prefix added.
// - Full external URLs (http://, https://) are left untouched.
const CONTENT_ROOT = join(process.cwd(), "content/docs");
const IMAGE_BASE_PATH = "/docs/magistrala";

function walk(node: MdastNode, visitor: (node: MdastNode) => void) {
  if (node.type === "image") visitor(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visitor);
  }
}

export function remarkDocImages() {
  return (tree: MdastNode, file: CompileFile) => {
    walk(tree, (node) => {
      if (typeof node.url !== "string" || node.url.length === 0) return;
      if (/^https?:\/\//.test(node.url)) return; // external, leave alone
      if (node.url.startsWith(IMAGE_BASE_PATH)) return; // already resolved

      if (node.url.startsWith("/")) {
        // Already site-root-absolute (the public/screenshots convention).
        node.url = `${IMAGE_BASE_PATH}${node.url}`;
        return;
      }

      // Relative to this source file's own directory.
      const fileDir = dirname(file.path);
      const absolute = normalize(join(fileDir, node.url));
      const relativeToContent = relative(CONTENT_ROOT, absolute);
      node.url = `${IMAGE_BASE_PATH}/${relativeToContent.split("\\").join("/")}`;
    });
  };
}
