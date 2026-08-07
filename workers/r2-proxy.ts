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

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

// DOM lib's ambient `caches` global is typed as the standard Web Cache API
// (CacheStorage without a `default` property -- that's a Workers-specific
// extension no browser has), so a cast is needed to reach it. See the
// module comment above for why this file avoids @cloudflare/workers-types.
interface CFCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}
interface CFCacheStorage {
  readonly default: CFCache;
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
  return async (
    path: string,
    env: Env,
    request: Request,
    ctx: ExecutionContext,
  ): Promise<Response> => {
    if (!path) return notFound();

    const bucket = env.IMAGES_BUCKET;
    if (!bucket) return notFound();

    // bucket.get() is an R2 binding call, not an HTTP subrequest -- it
    // never touches Cloudflare's HTTP cache. Without explicitly writing the
    // response into the Cache API, every request (from every visitor, at
    // every edge location) would re-read from R2, no matter what
    // Cache-Control header gets set on the returned Response. Using the
    // request's own URL (unmodified) as the cache key keeps this purgeable
    // by the existing purge-by-URL call in the publish-image script.
    const cache = (caches as unknown as CFCacheStorage).default;
    const cacheKey = new Request(request.url, request);

    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const object = await bucket.get(`${keyPrefix}/${path}`);
    if (!object) return notFound();

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("content-length", String(object.size));
    // Browser TTL long enough to skip most repeat-visit requests, short
    // enough to self-heal within the hour if a purge is ever missed. Edge
    // TTL is effectively unbounded -- the publish-image script purges it
    // explicitly and immediately on every upload, so there's no benefit to
    // a shorter one, and every edge location that has ever served an image
    // now actually caches it (see the Cache API use above).
    headers.set("cache-control", "public, max-age=3600, s-maxage=31536000");

    const response = new Response(object.body, { headers });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  };
}
