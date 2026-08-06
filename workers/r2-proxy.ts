// Shared handler factory for serving files out of the R2 bucket that backs
// this site's images/diagrams/screenshots. Mirrors the pattern used by the
// main absmach-website repo (src/lib/r2-proxy.ts), adapted for this repo's
// deployment shape: a plain Next.js static export served by Cloudflare
// Workers Static Assets (no next-on-pages / opennextjs adapter, no server
// runtime from Next.js itself). Because of that, this proxy is a small
// standalone Worker (see image-proxy.ts) that Cloudflare routes to ahead of
// static asset matching, rather than a Next.js route handler.
//
// Minimal local R2 typings on purpose (no `@cloudflare/workers-types`
// dependency) — this file is type-checked by the site's own tsconfig (DOM
// lib), and pulling in the Workers global types there would conflict with
// DOM's Request/Response/Headers types across the rest of the app.

export interface R2ObjectBody {
  body: ReadableStream;
  size: number;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

export interface Env {
  IMAGES_BUCKET: R2Bucket;
}

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "cache-control": "no-store" },
  });

// Shared bucket ("websites-images") holds assets for multiple properties;
// keyPrefix keeps this site's objects from colliding with other properties
// (and separates img/diagrams/screenshots from each other within this site).
export function createR2ProxyHandler(keyPrefix: string) {
  return async (path: string, env: Env): Promise<Response> => {
    if (!path) return notFound();

    const bucket = env.IMAGES_BUCKET;
    if (!bucket) return notFound();

    const object = await bucket.get(`${keyPrefix}/${path}`);
    if (!object) return notFound();

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("content-length", String(object.size));
    // Short browser TTL (revalidates quickly) + long edge TTL (until purged
    // explicitly by the publish-image script on upload).
    headers.set("cache-control", "public, max-age=300, s-maxage=31536000");

    return new Response(object.body, { headers });
  };
}
