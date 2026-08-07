# Publishing images (maintainers only)

This repo can serve images from a shared Cloudflare R2 bucket (`websites-images`,
shared with the main absmach-website property) instead of committing them to git, via a
small Worker that sits in front of the static export:

- [`workers/image-proxy.ts`](../workers/image-proxy.ts) — Worker entry point; routes
  `/docs/magistrala/img/*`, `/docs/magistrala/diagrams/*`, and
  `/docs/magistrala/screenshots/*` to R2, looked up via
  [`workers/r2-proxy.ts`](../workers/r2-proxy.ts)'s shared handler factory.
- `wrangler.jsonc`'s `assets.run_worker_first` — tells Cloudflare to route those three
  path prefixes to the Worker before it looks for a matching file in `out/`; every other
  request (docs pages, `_next/*`, everything else already in `out/`) is untouched and
  keeps being served as a static asset, exactly as before this change.

Only maintainers publish images, using [`publish-image.mjs`](./publish-image.mjs). The
script is safe to have in a public repo because it's inert without a token — nobody can
upload to the bucket just by reading this file. See "Why maintainer-only" below.

## How existing content images work now

`content/docs/img/`, `content/docs/diagrams/`, and `public/screenshots/` are gone from
git — every doc image is served from R2 through the proxy above. **Authoring is
unchanged**: write plain markdown image syntax exactly as before, relative paths and
all — `![alt](../img/foo.svg)`, `![alt](../../diagrams/bar.svg)`,
`![alt](/screenshots/baz.png)`. No new component, no manifest to fill in.

This works despite fumadocs-mdx's default `remarkImage` plugin normally needing the
file on local disk (to `import` it and/or to probe `width`/`height`) via two pieces:

1. `source.config.ts` sets `remarkImageOptions: false`, so markdown image syntax is
   left as a literal reference instead of being resolved/imported at build time.
2. [`lib/remark-doc-images.ts`](../lib/remark-doc-images.ts), a small remark plugin,
   resolves each image's path (relative to its source `.mdx` file's own location, or
   the fixed `/screenshots/...` prefix) into the literal
   `/docs/magistrala/{img,diagrams,screenshots}/...` URL the Worker above serves —
   pure path math against the file's known location, no image bytes needed. This
   fixed prefix (not the edition-aware base path the rest of the site uses) is what
   `workers/image-proxy.ts`'s routes actually match, since doc images are shared
   between the Community and Enterprise editions and always live at one canonical URL
   regardless of which edition rendered the page.

`mdx-components.tsx`'s `img:` override then renders anything already carrying that
resolved prefix as a plain, zoomable `<img>` (via fumadocs-ui's `ImageZoom`) — no
`next/image`, no `width`/`height` required, so there's nothing to keep in sync when
images change.

Adding a **new** doc image: just reference it from MDX the same way as any other —
`![alt](../img/your-new-file.png)` — then publish it with `publish-image.mjs` below.
Nothing else to update.

## One-time setup

1. Create `scripts/.env.publish-image` from the template:

   ```bash
   cp scripts/.env.publish-image.example scripts/.env.publish-image
   ```

2. Create a Cloudflare API token: dashboard -> **My Profile -> API Tokens -> Create Token
   -> Custom Token**, with both permissions on the same token:
   - `Workers R2 Storage: Edit`
   - `Zone -> Cache Purge -> Purge`, **Zone Resources** scoped to the `absmach.eu` zone

3. Paste the token into `CLOUDFLARE_API_TOKEN` in `scripts/.env.publish-image`. The zone
   ID is already filled in (it's the same `absmach.eu` zone the main website uses, since
   this site is served from a path under that domain — not secret, safe to share/commit).

4. Sanity-check the token before first use:

   ```bash
   curl -s https://api.cloudflare.com/client/v4/user/tokens/verify \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   ```

   Should return `"status":"active"`. If it doesn't, the token value itself is wrong
   (bad copy/paste, expired, revoked) — fix that before troubleshooting anything else.

`scripts/.env.publish-image` is gitignored. Never commit it, never paste the token value
into a PR, issue, or chat.

## Publishing an image

```bash
pnpm run publish-image <local-file> <public-path>
```

`<public-path>` is everything after the domain in the final URL — it must start with
`docs/magistrala/img/`, `docs/magistrala/diagrams/`, or `docs/magistrala/screenshots/` so
the script knows which route (and R2 key prefix) it belongs to. Examples:

```bash
pnpm run publish-image ./architecture.svg docs/magistrala/img/architecture.svg
# -> https://absmach.eu/docs/magistrala/img/architecture.svg

pnpm run publish-image ./group_users_viewer.svg docs/magistrala/diagrams/group_users_viewer.svg
# -> https://absmach.eu/docs/magistrala/diagrams/group_users_viewer.svg
```

The script does two things, in order:

1. `wrangler r2 object put ... --remote` — uploads to the **real** bucket. `--remote` is
   required; without it, `wrangler` silently writes to a local simulated bucket and prints
   a normal-looking "Upload complete" with no error, and the object is never actually live.
2. Purges that exact URL from Cloudflare's edge cache (`POST /zones/{id}/purge_cache`), so
   the update is visible within seconds instead of waiting out the cache TTL.

If you re-run the same command for an existing path, it overwrites the object in place and
purges again — that's the intended way to update an image without changing its URL.

## Previewing images locally

`pnpm run dev` (plain `next dev`) never shows doc images, published or not — it's a bare
Next.js dev server with no knowledge of `wrangler.jsonc`'s Worker/routing config, so
`workers/image-proxy.ts` never runs and `/docs/magistrala/img/*` 404s. This is expected,
not a bug; it's fine for content/layout work where the images themselves don't matter.

To actually see real, published images locally, run the site the same way it's deployed
(`pnpm run deploy` uses plain `wrangler deploy`, **not** `wrangler pages deploy` — this repo
is a Workers-with-static-assets project, not a Pages project, so `wrangler pages dev` is the
wrong command and won't pick up the R2 binding at all):

```bash
pnpm run build          # produces ./out
npx wrangler dev --port 8789
```

This runs the real Worker in front of the real static export, and — because
`wrangler.jsonc`'s R2 binding has `"remote": true` — `IMAGES_BUCKET` connects to the actual
`websites-images` bucket instead of an empty local simulator, so any image already published
via `publish-image.mjs` (or the one you're about to publish) renders exactly as it would in
production. Requires being logged in (`wrangler whoami`; `wrangler login` if not) with access
to the account that owns `websites-images` — no token file needed for this, remote bindings
piggyback on your own Wrangler OAuth session, separate from `publish-image.mjs`'s
maintainer-only `CLOUDFLARE_API_TOKEN`.

Needs `wrangler` >= 4.120.0. Earlier versions (this repo was briefly pinned to 4.94.0) have a
bug where a remote R2 binding throws `SyntaxError: Unexpected end of JSON input` instead of
actually proxying to R2 — if you see that, `pnpm update wrangler` first.

## Why maintainer-only

This repo is public. The risk isn't the script being visible — it's inert without a
credential. The risk is _credential distribution_: whoever holds `CLOUDFLARE_API_TOKEN`
can write to the shared bucket. So nobody, internal or external, gets a personal R2 token.
Only a maintainer, holding this one scoped token, runs `publish-image`.

## Troubleshooting

- **`Local file not found: --`** — you ran `pnpm run publish-image -- <file> <dest>`. pnpm
  forwards a leading `--` to the script literally instead of stripping it like npm does.
  The script strips it defensively now, but plain `pnpm run publish-image <file> <dest>`
  (no `--`) is the form to use.
- **`Destination must start with "docs/magistrala/img/", ...`** — the second argument is
  everything after the domain, including `docs/magistrala/`, not a path relative to `/img/`.
- **`Resource location: local` in the upload output** — means `--remote` didn't get
  applied for some reason (e.g. running the underlying `wrangler` command by hand without
  copying the full flag list from the script). The object was never written to the real
  bucket even though the CLI reports success. Always use `pnpm run publish-image`, or add
  `--remote` yourself if invoking wrangler directly.
- **`Cache purge failed` / `Authentication error` (code 10000)** — Cloudflare reuses this
  code for both "bad token" and "token valid but missing this permission." Run the token
  verify curl command above first to rule out a bad token. If that succeeds, the token is
  missing `Zone -> Cache Purge -> Purge` for the `absmach.eu` zone, or that permission's
  Zone Resources selector doesn't include it — edit the token in the dashboard and add it.
- To confirm an object actually made it into the bucket after a `--remote` upload:

  ```bash
  wrangler r2 object get websites-images/magistrala-docs/<img|diagrams|screenshots>/<path> --remote --file=/tmp/check
  ```
