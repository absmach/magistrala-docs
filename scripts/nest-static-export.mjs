import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const basePath = path.join(
  ...(process.env.NEXT_PUBLIC_BASE_PATH || "/docs/magistrala/v0-51-0")
    .split("/")
    .filter(Boolean),
);
const nestedDir = path.join(outDir, basePath);
const tempDir = path.join(outDir, ".basepath-root");
const controlFiles = new Set(["_headers", "_redirects"]);

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

if (!(await pathExists(outDir))) {
  throw new Error("Missing out/ directory. Run next build before nesting.");
}

// Next's static-export adapter writes _redirects/_headers against the app's
// unversioned root ("/docs/magistrala") regardless of the basePath actually
// configured for this build pass -- confirmed by running an isolated build
// with only NEXT_PUBLIC_BASE_PATH's default (v0-51-0) in effect and seeing
// unversioned paths in the output anyway. Rewrite them to this pass's real
// base path so the generated redirect/header rules actually match requests
// this deployment receives (e.g. the bare version-root path 404ing instead
// of redirecting, since the emitted rule's source path never matched).
const UNVERSIONED_ROOT = "/docs/magistrala";
const fullBasePath = `/${basePath}`;

async function fixControlFilePaths(fileName) {
  if (fullBasePath === UNVERSIONED_ROOT) return; // nothing to fix (e.g. latest)
  const filePath = path.join(outDir, fileName);
  if (!(await pathExists(filePath))) return;
  const content = await fs.readFile(filePath, "utf8");
  await fs.writeFile(filePath, content.split(UNVERSIONED_ROOT).join(fullBasePath));
}

await fixControlFilePaths("_redirects");
await fixControlFilePaths("_headers");

await fs.rm(tempDir, { recursive: true, force: true });
await fs.mkdir(tempDir, { recursive: true });

for (const entry of await fs.readdir(outDir, { withFileTypes: true })) {
  if (entry.name === path.basename(tempDir) || controlFiles.has(entry.name)) {
    continue;
  }

  await fs.rename(
    path.join(outDir, entry.name),
    path.join(tempDir, entry.name),
  );
}

await fs.rm(nestedDir, { recursive: true, force: true });
await fs.mkdir(nestedDir, { recursive: true });

for (const entry of await fs.readdir(tempDir)) {
  await fs.rename(path.join(tempDir, entry), path.join(nestedDir, entry));
}

await fs.rmdir(tempDir);

console.log(`Nested static export under out/${basePath}`);
