# Magistrala docs: v0.51.0 snapshot + Latest overhaul — plan

Status: v0.51.0 snapshot prepared and committed locally (not pushed). Latest branch structure created (empty). Content audit/rewrite not yet started — this plan is checkpointed here for review before that (much larger) phase begins.

## 1. Current-state findings

- **Versioning precedent (`v0.30.0`)**: a fully independent deployment — own Worker name (`magistrala-docs-v0-30-0`), own `wrangler.jsonc` `routes` entry (`absmach.eu/docs/magistrala/v0-30-0/*`), own hardcoded `basePath`/`baseUrl` in `next.config.mjs` + `lib/base-path.ts`. It predates two things that now exist on `main`: the R2-backed image system and the Enterprise/Community edition split. It committed screenshots directly to git under `public/screenshots/`.
- **Current `main` architecture** has moved on from that precedent in two ways `v0.51.0` had to account for (not blindly copy):
  - **Editions**: `scripts/build-editions.mjs` runs two `next build` passes (Enterprise at `/docs/magistrala/`, Community nested at `/docs/magistrala/community/`) and merges them into one `out/`, one Worker, one Cloudflare project. Page/folder-level `enterprise: true` gating lives in `source.config.ts`/`lib/source.tsx`.
  - **Images**: nothing is committed to git anymore (verified: `public/screenshots/` has 0 files, `content/docs/img/` has only a non-rendered `architecture.xml` source). All images/diagrams/screenshots are served from the shared R2 bucket `websites-images` via `workers/image-proxy.ts` (routed ahead of static assets by `wrangler.jsonc`'s `run_worker_first`), with markdown paths resolved to R2-proxy URLs at build time by `lib/remark-doc-images.ts`. Maintainers publish via `scripts/publish-image.mjs`.
- **Docs tree** (`content/docs`): `user-guide/domain-management/` and `user-guide/clients-management/` are the two folders the Domains→Workspaces and Clients→Devices renames land in. No existing folders for Gateways or Device Types — new content. `dev-guide` is a separate tree (`entities`, `services`, `api`, `authorization`, `cli`, `dev-tools`, `edge`, `certs`, `extensions`, `benchmark`, `architecture`, `storage-architecture`, `getting-started`, `introduction`, `agent`).

## 2. v0.51.0 snapshot — done

```text
v0.51.0 snapshot SHA: e392db813f33bd46db434334d25df9932de51c64
v0.51.0 branch: v0.51.0 (local only, 2 commits ahead of the snapshot point, not pushed)
Expected URL: https://absmach.eu/docs/magistrala/v0-51-0/
```

Commits on `v0.51.0`:
1. `Deploy v0.51.0 docs as a separate versioned app` — config fork (see below).
2. `Add v0.51.0 image preservation handoff` — the R2 copy to-do list.

**Config changes**, all scoped to `v0.51.0` only (nothing here touches `main`):

| File | Change |
|---|---|
| `wrangler.jsonc` | `name` → `magistrala-docs-v0-51-0`; added `routes` (`absmach.eu/docs/magistrala/v0-51-0/*`); `run_worker_first` paths versioned |
| `workers/image-proxy.ts` | `BASE_PATH` and R2 `keyPrefix`s versioned to `magistrala-docs/v0-51-0/{img,diagrams,screenshots}` — see immutability note below |
| `next.config.mjs`, `lib/base-path.ts`, `lib/metadata.ts` | versioned `basePath`/`baseUrl` defaults hardcoded in code, not left to a Cloudflare dashboard env var (v0.30.0 needed a manual `NEXT_PUBLIC_BASE_URL` dashboard variable for this; v0.51.0 doesn't) |
| `lib/remark-doc-images.ts` | `IMAGE_BASE_PATH` versioned (hardcoded, edition-independent — mirrors how `main` already handles this constant across its own two edition passes) |
| `scripts/build-editions.mjs` | Community pass base path versioned |
| `lib/edition.ts`, `app/layout.tsx` | Edition switcher now renders on `v0.51.0` too (not just `latest`) since this snapshot, unlike `v0.30.0`, genuinely ships both editions; its target paths are versioned so switching editions doesn't jump back to `latest` |
| `lib/versions.ts` | adds itself to the version list, `CURRENT_VERSION = "v0.51.0"` |
| `README.md` | rewritten as the version-branch deployment doc (mirrors `v0.30.0`'s own README, adapted for editions + R2) |

No documentation content was touched — only deployment/config plumbing, which is the allowed scope for this branch.

**Image immutability strategy** (the actual design decision, not blindly implementing the prompt's sample path): `v0.51.0`'s Worker reads a **version-scoped R2 prefix** (`magistrala-docs/v0-51-0/...`) that is a one-time copy of what `main` referenced at freeze time. `latest` keeps using the existing **unversioned** prefix (`magistrala-docs/{img,diagrams,screenshots}/...`) with zero changes — `lib/remark-doc-images.ts`, `workers/image-proxy.ts`, and `scripts/publish-image.mjs` on `main`/Latest are untouched. This was chosen over renamespacing Latest itself (e.g. `.../latest/...`) because Latest already has hundreds of existing R2 objects under the unversioned keys; forcing a rewrite there for symmetry would be a large, risky migration for no benefit, and would violate "existing docs must not break." Every future version freeze repeats the same pattern: fork the Worker to a new version-scoped prefix, bulk-copy once.

**Remaining manual work for `v0.51.0`** (not done by me, per the prompt's rules):
- Run the R2 copy in `v0.51.0-image-preservation-handoff.md` (535 objects, 3 `rclone copy` commands) — **must happen before this branch is deployed**, otherwise every image 404s.
- Create the Cloudflare Workers Builds project (production branch `v0.51.0`, settings documented in `v0.51.0`'s `README.md`).
- Push the `v0.51.0` branch (not pushed by me).

## 3. Latest branch plan — content areas, not one branch

Per your call, the Latest overhaul is split into independent branches by content area rather than one big branch/PR, so each PR touches a mostly-distinct set of files and can be reviewed on its own. All branches below fork from the same point as `v0.51.0` (`e392db8`) and target `main` independently — none are stacked on each other.

| Branch | Scope | Status |
|---|---|---|
| `docs/latest-version-switcher` | Add `v0.51.0` to `lib/versions.ts` on the Latest side | **Done, committed** (1 commit) |
| `docs/latest-workspaces` | Domains → Workspaces: `user-guide/domain-management/`, any dev-guide/API references, screenshots | Created, empty |
| `docs/latest-devices` | Clients → Devices: `user-guide/clients-management/`, dev-guide/API references, screenshots | Created, empty |
| `docs/latest-gateways` | New Gateway docs (concept, creation, publish-on-behalf-of, Channel relationship, auth) | Created, empty |
| `docs/latest-device-types` | New Device Type docs (not Atom's `Profile`) | Created, empty |
| `docs/latest-user-guide` | Remaining user-guide pages: solution-packs, dashboards, rules-engine, messaging, message-views, alarms, reports, white-labeling, profile-management, pats, metadata, users-quick-start — **including** Enterprise-gated accuracy for these (Reports/Alarms/Rules Engine/Dashboards are Enterprise-only, so Agent E's findings feed in here rather than a separate Enterprise branch) | Created, empty |
| `docs/latest-dev-guide` | Full dev-guide audit + rewrite, including any Enterprise-gated dev-guide content | Created, empty |
| `docs/latest-final-qa` | Cross-cutting sweep, run **last** after the branches above have merged: leftover `Domain`/`Client` terminology, broken links, stale screenshots missed by area-owners, `magistrala-ee` link check | Created, empty |

I dropped a standalone "Enterprise" PR and an "R2 infra" PR from the original per-agent breakdown: Enterprise-only pages already live inside the user-guide/dev-guide trees, so a separate PR touching the same files would fight the content-area PRs instead of avoiding conflicts with them — Enterprise accuracy is folded into whichever PR already owns those pages. And per the image immutability decision above, Latest needs zero R2/infra code changes, so there's nothing for a separate infra PR to contain.

```text
PR target for every docs/latest-* branch: main
```

## 4. Documentation gap matrix

Not yet populated — this is the output of the repo audits (Agent B/C/D/E equivalents below), which haven't run yet. Will be filled in per content-area branch as each audit completes:

| Product change | Source evidence | Existing docs | Required change | Owner branch | Screenshot needed? |
|---|---|---|---|---|---|
| _pending audit_ | | | | | |

## 5–6. User-guide / dev-guide page classification

Not yet done — depends on the audits above (need to diff current `magistrala`/`magistrala-ui` behavior against each existing page before classifying add/rewrite/rename/remove/split/merge/screenshot-only).

## 7. Screenshot plan

Inventory not yet built. Known from the R2 handoff: current Latest content references 471 `img/`, 20 `diagrams/`, 44 `screenshots/` objects (535 total) — that's the *current* baseline to diff against once the UI audit (Agent C) identifies what changed (Workspaces/Devices rename, Gateways, Device Types, sidebar redesign). Assume every screenshot is stale until verified per the prompt's rule; do not scope down to only client/domain-named files.

## 8. R2 strategy

Covered under §2 — Latest stays on the existing unversioned prefix, zero code changes required.

## 9. Agent assignments for the next phase

Not yet dispatched — checkpointing here first. Planned mapping (adapted from the original Agent A–H roster to the 8 branches above; Agent A's work is what's already done in §2):

| Branch | Feeds from | Model tier | Notes |
|---|---|---|---|
| `docs/latest-workspaces` | `/home/ian/work/magistrala`, `/home/ian/work/magistrala-ui` (Agent B/C equivalents) | Sonnet-class | Terminology classification required — don't blind-replace `domain` |
| `docs/latest-devices` | same | Sonnet-class | Same care for `client` (MQTT/HTTP/API client are legitimate, unrelated terms) |
| `docs/latest-gateways` | `edge/architecture.md`, `edge/prd/**`, `/home/ian/work/atom`, `/home/ian/work/magistrala-ui` (Agent D equivalent) | Strong reasoning | Must distinguish implemented vs. planned/deferred/withdrawn |
| `docs/latest-device-types` | same sources, Atom's `Profile` → public `Device Type` | Strong reasoning | Same PRD-vs-implementation caution |
| `docs/latest-user-guide` | `/home/ian/work/magistrala-ui`, `/home/ian/work/magistrala-ee` (Agent C/E) | Sonnet-class | |
| `docs/latest-dev-guide` | `/home/ian/work/magistrala`, `/home/ian/work/magistrala-ee` (Agent B/E) | Sonnet-class | Validate commands against actual `Makefile`/CLI `--help`, don't copy stale ones |
| Screenshot capture (cuts across the branches above, done per-branch as its content lands) | Chrome DevTools MCP against `localhost:3000` | lower-cost / tool-heavy | Fixtures per the prompt's naming rules; staged in a gitignored dir, never committed |
| `docs/latest-final-qa` | grep/rg sweep, no repo audit needed | lower-cost | Runs last |

**Must not edit concurrently**: any two branches touching the same `content/docs/**/meta.json` (sidebar nav) — flagged as a likely convergence point across `docs/latest-workspaces`, `docs/latest-devices`, `docs/latest-gateways`, `docs/latest-device-types` since they may all want to adjust `user-guide/meta.json`'s `pages` order. Whichever merges first should be the one to touch `meta.json`; later branches rebase.

## 10. Validation plan

Per branch, before it's called PR-ready:
- `pnpm install && pnpm lint && pnpm build` (Enterprise + Community both build)
- Cross-cutting terminology scan (`rg` for stray `Domain(s)`/`Client(s)`) scoped to that branch's changed files
- Link check (internal, anchors, no `magistrala-ee` exposure)
- Chrome DevTools spot check of any pages with new/changed screenshots

Before `main` is considered done: full-tree terminology scan and link validation across the merged result (this is what `docs/latest-final-qa` exists to catch).

---

## Next step

The audits (Agent B–E equivalents: `/home/ian/work/magistrala`, `/home/ian/work/magistrala-ui`, `/home/ian/work/atom`, `/home/ian/work/fluxmq`, `/home/ian/work/magistrala-ee`) and the actual content rewrite across the 7 content-area branches have **not started** — that's the large remaining phase. Confirm this plan (branch split, R2/immutability design, dropped Enterprise/infra PRs) before I dispatch it.
