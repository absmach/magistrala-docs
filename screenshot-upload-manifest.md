# Screenshot upload manifest — Latest overhaul, capture pass 1

Staged locally (gitignored, not committed) at:
```text
/home/ian/work/company-repos/magistrala-docs/.tmp/docs-screenshots/latest/
```
**Note on that path**: the Chrome DevTools MCP screenshot tool resolves relative/explicit paths against the main repo working directory, not this agent's isolated git worktree — so despite running in an isolated worktree, every file above landed in the main checkout's `.tmp/`, not inside the worktree. Not a git-tracking problem (it's gitignored either way) but worth knowing before looking for the files in the wrong place.

18 screenshots captured out of an estimated 400+ site-wide. This pass prioritized the newest/renamed core concepts (Workspaces, Devices+Channels+Groups, Gateways) end-to-end over broad shallow coverage. Fixtures created in workspace **Demo Workspace**: devices **Temperature Sensor** and **Water Meter** (Water Meter later also used as the gateway's declared-device target is Temperature Sensor), gateway **Office Gateway** (device with Gateway mode on, one declared device attached), channel **Telemetry Channel** (connected to Temperature Sensor). All under account `johnDoe`. Nothing destructive was done to the pre-existing `w1-updated`/`w3`/`w4` workspaces or their contents — only additive fixture creation.

R2 destination format follows `scripts/publish-image.mjs`'s existing convention, verified against the actual `content/docs/**/*.mdx` markdown image references on each branch (not guessed) — **most of these UI screenshots route through the `img/` prefix, not `screenshots/`** (that prefix is reserved for the solution-pack marketing screenshots — see the "Not captured" section).

## Captured — Workspaces (`docs/latest-workspaces`)

| Local file | R2 destination | Public URL | Referenced by | Status |
|---|---|---|---|---|
| `workspace/workspace-dialog.png` | `docs/magistrala/img/workspace/workspace-dialog.png` | `https://absmach.eu/docs/magistrala/img/workspace/workspace-dialog.png` | `workspace-management/workspace.mdx` | captured |
| `workspace/created-workspace.png` | `docs/magistrala/img/workspace/created-workspace.png` | .../img/workspace/created-workspace.png | `workspace.mdx` | captured |
| `workspace/workspace-homepage.png` | `docs/magistrala/img/workspace/workspace-homepage.png` | .../img/workspace/workspace-homepage.png | `workspace.mdx` | captured |
| `workspace/workspace-settings.png` | `docs/magistrala/img/workspace/workspace-settings.png` | .../img/workspace/workspace-settings.png | `workspace.mdx` | captured |
| `workspace/workspace-members.png` | `docs/magistrala/img/workspace/workspace-members.png` | .../img/workspace/workspace-members.png | `workspace.mdx` | captured |
| `workspace/roles.png` | `docs/magistrala/img/workspace/roles.png` | .../img/workspace/roles.png | `workspace.mdx` | captured |

Publish commands:
```bash
pnpm run publish-image .tmp/docs-screenshots/latest/workspace/workspace-dialog.png docs/magistrala/img/workspace/workspace-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/workspace/created-workspace.png docs/magistrala/img/workspace/created-workspace.png
pnpm run publish-image .tmp/docs-screenshots/latest/workspace/workspace-homepage.png docs/magistrala/img/workspace/workspace-homepage.png
pnpm run publish-image .tmp/docs-screenshots/latest/workspace/workspace-settings.png docs/magistrala/img/workspace/workspace-settings.png
pnpm run publish-image .tmp/docs-screenshots/latest/workspace/workspace-members.png docs/magistrala/img/workspace/workspace-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/workspace/roles.png docs/magistrala/img/workspace/roles.png
```

`create-workspace.png` (alt text "Workspaces Empty State") was not captured as a separate file — the pre-existing `johnDoe` account already owns 3 other workspaces (`w1-updated`, `w3`, `w4`, likely fixtures from other concurrent sessions on this shared environment), so a true empty state isn't reachable without deleting data that isn't mine. `created-workspace.png` (the populated list) is the closest honest substitute; consider either accepting that image for both references or re-doing this one with a fresh account.

## Captured — Devices / Channels / Groups (`docs/latest-devices`)

| Local file | R2 destination | Referenced by | Status |
|---|---|---|---|
| `devices/client-create.png` | `docs/magistrala/img/devices/client-create.png` | `device-management/devices.mdx` | captured |
| `devices/client-create-buttons.png` | `docs/magistrala/img/devices/client-create-buttons.png` | `devices.mdx` | captured |
| `devices/client-view.png` | `docs/magistrala/img/devices/client-view.png` | `devices.mdx` | captured |
| `devices/client-connections.png` | `docs/magistrala/img/devices/client-connections.png` | `devices.mdx` | captured |
| `devices/client-connect-channel.png` | `docs/magistrala/img/devices/client-connect-channel.png` | `devices.mdx` | captured |
| `devices/channel-create.png` | `docs/magistrala/img/devices/channel-create.png` | `channels.mdx` | captured (used for the "create" reference; shows post-creation list) |
| `devices/channel-view.png` | `docs/magistrala/img/devices/channel-view.png` | `channels.mdx` | captured |
| `devices/group-create-button.png` | `docs/magistrala/img/devices/group-create-button.png` | `groups.mdx` | captured (empty-state list) |

Publish commands:
```bash
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-create.png docs/magistrala/img/devices/client-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-create-buttons.png docs/magistrala/img/devices/client-create-buttons.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-view.png docs/magistrala/img/devices/client-view.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-connections.png docs/magistrala/img/devices/client-connections.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-connect-channel.png docs/magistrala/img/devices/client-connect-channel.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-create.png docs/magistrala/img/devices/channel-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-view.png docs/magistrala/img/devices/channel-view.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-create-button.png docs/magistrala/img/devices/group-create-button.png
```

**Not captured, 68 remaining** in this folder (`devices.mdx` 23 total, `channels.mdx` 29 total, `groups.mdx` 24 total — 8 done above). Regenerate the exact remaining list any time with:
```bash
git show docs/latest-devices:content/docs/user-guide/device-management/devices.mdx | grep -oE '!\[[^]]*\]\([^)]+\)'
git show docs/latest-devices:content/docs/user-guide/device-management/channels.mdx | grep -oE '!\[[^]]*\]\([^)]+\)'
git show docs/latest-devices:content/docs/user-guide/device-management/groups.mdx | grep -oE '!\[[^]]*\]\([^)]+\)'
```
Every path resolves to `docs/magistrala/img/devices/<name>.png` (folder renamed from `img/clients/`, leaf filenames intentionally kept as `client-*`/`channel-*`/`group-*` per the devices agent's own decision — do not rename them to `device-*` when capturing, they must match the `.mdx` source exactly).

Also not captured: `img/billing/*` (11 files) and `img/invitations/*` (7 files) under `workspace-management/` — same filenames as today, content is stale only in that dialogs now say "Workspace" instead of "Domain" in a few places (per the workspaces agent's report).

## Captured — Gateways (`docs/latest-gateways`)

| Local file | R2 destination | Referenced by | Status |
|---|---|---|---|
| `gateways/gateways-list.png` | `docs/magistrala/img/gateways/gateways-list.png` | `gateway-management/gateways.mdx` | captured |
| `gateways/gateway-create.png` | `docs/magistrala/img/gateways/gateway-create.png` | `gateways.mdx` | captured |
| `gateways/gateway-devices-panel.png` | `docs/magistrala/img/gateways/gateway-devices-panel.png` | `gateways.mdx` | captured |
| `gateways/gateway-add-devices-dialog.png` | `docs/magistrala/img/gateways/gateway-add-devices-dialog.png` | `gateways.mdx` | captured |

Publish commands:
```bash
pnpm run publish-image .tmp/docs-screenshots/latest/gateways/gateways-list.png docs/magistrala/img/gateways/gateways-list.png
pnpm run publish-image .tmp/docs-screenshots/latest/gateways/gateway-create.png docs/magistrala/img/gateways/gateway-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/gateways/gateway-devices-panel.png docs/magistrala/img/gateways/gateway-devices-panel.png
pnpm run publish-image .tmp/docs-screenshots/latest/gateways/gateway-add-devices-dialog.png docs/magistrala/img/gateways/gateway-add-devices-dialog.png
```

This folder is **complete** — all 4 images `gateways.mdx` references are captured.

## Not captured — Device Types (`docs/latest-device-types`)

`user-guide/device-types/{introduction,capabilities}.mdx` currently reference **zero images** (verified: `grep -oE '!\[[^]]*\]\([^)]+\)'` on both files returns nothing). The 6-item screenshot list from that agent's earlier report (list/create/detail/versions/create-version/bind) describes real UI I confirmed exists and works — visited `/workspace/{id}/device-types` directly and saw the exact default catalogue the docs describe (Energy Meter, Pressure Sensor, Pump Controller, Water Meter) — but there's nothing in the current `.mdx` source to embed them into. Capturing them now would produce orphaned files. **Decision needed**: either the device-types content author adds image embeds first (then this list is ready to shoot), or this page stays text-only by design.

## Not captured — Bootstrap (`docs/latest-user-guide`)

Same situation: `bootstrap.mdx` references zero images. Verified the feature is real (`/workspace/{id}/bootstraps`, Profiles/Configs tabs both present). No screenshots to take until the page embeds some.

## Not captured — everything else

Not reached this pass: Dashboards (17 files), Rules Engine (3 files), Cold Storage Monitoring solution pack (entirely new, no baseline), and the remaining user-guide pages (messaging, alarms, reports, message-views, white-labeling, profile-management, metadata, users-quick-start — prior agents flagged specific known-stale files: `img/users-guide/group-client*`, `group-clients-create`, `group-channel-connections`, `janedoe-domainshome`, `jdoe-create-domain`, `img/white-labeling/branding-applied-sidebar`, `branding-collapsed-sidebar`). Same recovery method as above — `git show <branch>:<path> | grep -oE '!\[[^]]*\]\([^)]+\)'` on each `.mdx` file gives the authoritative current list; don't rely on any agent's prose manifest over the actual doc source, since doc content may have shifted since those manifests were written.

## UI surprises worth flagging

- The `Client Key` field label persists at the **DOM accessible-name level** inside the Device/Gateway configuration forms (`textbox "Client Key"`), even though the visible label text says "Device Key" — matches the devices agent's finding, confirmed independently here.
- `/workspace/{id}/gateways` is a filtered view of the same Devices table (identical columns, "Search Device" placeholder, same empty-state copy) — confirms the gateways agent's model that a Gateway is not a separate entity type, just `is_gateway=true` on a Device. The Gateways page's own "Create" dialog omits the `Gateway mode` toggle and the "Gateways" (uplink) combobox that the plain Devices create dialog shows — it's implicitly pre-set.
- Gateway's Devices tab literally displays copy: "Declared and observed — each device's status reflects whether it has actually been heard from, not just whether it was commissioned here." — real, verified in-product language worth quoting directly in the docs if not already.
