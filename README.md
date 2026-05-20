# Magistrala Docs

Documentation site for [Magistrala](https://github.com/absmach/magistrala), built with [Fumadocs](https://fumadocs.dev) and Next.js.

Visiting `/` redirects to `/docs`.

## Development

```bash
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

## Deployment

This site uses:

- **Next.js static export** — `next build` outputs static files to `out/`
- **Cloudflare Worker assets binding** — serves `out/` via `MG_WEBSITE_ASSETS`
- **`src/index.ts`** — the Worker entrypoint; all routes are served from the assets binding, with no-cache headers applied to `robots.txt` and `sitemap.xml`

### Cloudflare build settings (Dashboard)

| Setting          | Value                   |
|------------------|-------------------------|
| Build command    | `pnpm run build`        |
| Deploy command   | `npx wrangler deploy`   |
| Version command  | `npx wrangler versions upload` |
| Root directory   | `/`                     |

### Architecture

```mermaid
flowchart LR
  subgraph Build_and_Deploy
    A[Git push] --> B[Cloudflare build trigger]
    B --> C[pnpm run build]
    C --> D[next build — static export]
    D --> E[out/ static assets]
    B --> F[npx wrangler deploy]
    E --> G[MG_WEBSITE_ASSETS binding]
    F --> G
  end

  subgraph Runtime_Request_Flow
    U[Browser request] --> H[Cloudflare Worker src/index.ts]
    H --> J[Read from MG_WEBSITE_ASSETS]
    J --> U
  end
```

## Environment Variables

Only one runtime variable is needed:

```env
NEXT_PUBLIC_BASE_URL=https://magistrala.absmach.eu
```

Set this as a Cloudflare build variable so it is embedded into the static output at build time.

## Project structure

| Path                        | Description                                             |
|-----------------------------|---------------------------------------------------------|
| `app/page.tsx`              | Root redirect to `/docs`                                |
| `app/docs`                  | Documentation layout and pages                          |
| `app/api/search/route.ts`   | Static search index route handler                       |
| `app/og/[...slug]`          | OG image generation for docs pages                      |
| `app/llms-full.txt`         | LLM-readable full docs text                             |
| `content/docs`              | MDX source files                                        |
| `lib/source.ts`             | Fumadocs source adapter                                 |
| `lib/layout.shared.tsx`     | Shared layout options                                   |
| `src/index.ts`              | Cloudflare Worker entrypoint                            |

## Learn More

- [Fumadocs](https://fumadocs.dev)
- [Next.js Documentation](https://nextjs.org/docs)
