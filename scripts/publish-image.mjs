#!/usr/bin/env node
// Maintainer-only. Uploads an image or diagram to the shared R2 bucket and
// purges it from Cloudflare's edge cache, so it's live right after this
// finishes. Requires CLOUDFLARE_API_TOKEN (scoped: R2 Edit on
// websites-images + Zone Cache Purge on absmach.eu) and CLOUDFLARE_ZONE_ID.
//
// Usage:
//   pnpm run publish-image <local-file> <public-path>
//
// <public-path> is everything after the domain, starting with
// "docs/magistrala/img/", "docs/magistrala/diagrams/", or
// "docs/magistrala/screenshots/" to match the route that will serve it back:
//   pnpm run publish-image ./architecture.svg docs/magistrala/img/architecture.svg
//   pnpm run publish-image ./group_users_viewer.svg docs/magistrala/diagrams/group_users_viewer.svg
//   pnpm run publish-image ./solution-packs.png docs/magistrala/screenshots/solutions/solution-packs.png
//
// See scripts/README.md and workers/image-proxy.ts for the full picture —
// in particular, this only applies to images that are already referenced by
// an absolute /docs/magistrala/... URL. Most of this repo's docs images are
// still committed to git and bundled by Next.js at build time (see
// scripts/README.md for why); this script doesn't change that on its own.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { extname } from "node:path";
import process from "node:process";

const BUCKET_NAME = "websites-images";
const SITE_ORIGIN = "https://absmach.eu";
const BASE_PATH = "docs/magistrala";

// Maps the path segment right after BASE_PATH (the route) to where objects
// for it live in the bucket. Keep in sync with workers/image-proxy.ts and
// wrangler.jsonc's assets.run_worker_first list.
const ROUTES = {
  img: { keyPrefix: "magistrala-docs/img" },
  diagrams: { keyPrefix: "magistrala-docs/diagrams" },
  screenshots: { keyPrefix: "magistrala-docs/screenshots" },
};

const MIME_TYPES = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

try {
  process.loadEnvFile(new URL("./.env.publish-image", import.meta.url));
} catch {
  // No local env file — assume CLOUDFLARE_API_TOKEN / CLOUDFLARE_ZONE_ID
  // are already exported (e.g. in CI).
}

// pnpm forwards a leading "--" to the underlying command instead of
// stripping it (unlike npm), so tolerate it either way.
const cliArgs = process.argv.slice(2).filter((arg) => arg !== "--");
const [localFile, publicPath] = cliArgs;

if (!localFile || !publicPath) {
  console.error(
    "Usage: pnpm run publish-image <local-file> <public-path>\n" +
      "Example: pnpm run publish-image ./architecture.svg docs/magistrala/img/architecture.svg",
  );
  process.exit(1);
}

if (!existsSync(localFile)) {
  console.error(`Local file not found: ${localFile}`);
  process.exit(1);
}

const destKey = publicPath.replace(/^\/+/, "");
if (!destKey.startsWith(`${BASE_PATH}/`)) {
  console.error(`Destination must start with "${BASE_PATH}/", got: ${destKey}`);
  process.exit(1);
}
const afterBase = destKey.slice(BASE_PATH.length + 1);
const [routeName, ...restParts] = afterBase.split("/");
const route = ROUTES[routeName];
if (!route || restParts.length === 0) {
  console.error(
    `Destination must start with "${BASE_PATH}/img/", "${BASE_PATH}/diagrams/", ` +
      `or "${BASE_PATH}/screenshots/" and include a path, got: ${destKey}`,
  );
  process.exit(1);
}
const restPath = restParts.join("/");

const contentType = MIME_TYPES[extname(restPath).toLowerCase()];
if (!contentType) {
  console.error(`Unrecognized file extension for: ${destKey}`);
  process.exit(1);
}

const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID } = process.env;
if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
  console.error(
    "Missing CLOUDFLARE_API_TOKEN and/or CLOUDFLARE_ZONE_ID.\n" +
      "Copy scripts/.env.publish-image.example to scripts/.env.publish-image and fill in the token.",
  );
  process.exit(1);
}

const objectPath = `${BUCKET_NAME}/${route.keyPrefix}/${restPath}`;

console.log(`Uploading ${localFile} -> r2://${objectPath}`);
execFileSync(
  "wrangler",
  [
    "r2",
    "object",
    "put",
    objectPath,
    `--file=${localFile}`,
    `--content-type=${contentType}`,
    "--remote",
  ],
  { stdio: "inherit", env: process.env },
);

const publicUrl = `${SITE_ORIGIN}/${destKey}`;

console.log(`Purging edge cache for ${publicUrl}`);
const purgeResponse = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files: [publicUrl] }),
  },
);

const purgeResult = await purgeResponse.json();
if (!purgeResponse.ok || !purgeResult.success) {
  console.error("Cache purge failed:", JSON.stringify(purgeResult, null, 2));
  process.exit(1);
}

console.log(`Done. Live at ${publicUrl}`);
