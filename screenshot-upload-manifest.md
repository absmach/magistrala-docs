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

**Update (pass 2): this folder is now complete except for 3 images blocked by environment limits.** See the "Pass 2 — Devices / Channels / Groups completion" section below for the full breakdown and publish commands. The paragraph below is left as-is from pass 1 for the regeneration snippet, which is still useful:
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

## Out of scope — Dashboards (explicit, pass 2)

**Dashboards (`content/docs/user-guide/dashboards/**`) are explicitly out of scope for this pass.** This is a deliberate scope decision from the user, not a time-ran-out gap: partway through pass 2, dashboard screenshots were dropped entirely so the remaining time could go to Devices/Channels/Groups completion and Rules Engine + Messaging/Message Views instead (the latter two are directly load-bearing for each other — a message only shows up in any message table/view once a Rules Engine rule with an Internal DB output exists to persist it). 14 dashboard screenshots were captured during this pass before the scope change landed (create-dash, card-view, table-view, sort-options, editmode-checked, layouts, add-widget, create-valuecard, valuecard-icons, new-valuecard, widget-menu, enable-dummy, disable-dummy, edit-settings) and were **deleted** (`rm -rf .tmp/docs-screenshots/latest/dashboards/`) rather than left half-finished. Nothing in `docs/magistrala/img/dashboards/` should be expected from this pass. A future pass should start dashboards fresh — also worth flagging first: a genuine product bug found while working on this (see UI surprises below) that destroyed a Value Card widget on edit, which will need to be worked around or fixed before dashboard screenshots can be captured reliably.

## Not captured — everything else

Not reached this pass: Cold Storage Monitoring solution pack (entirely new, no baseline), and the remaining user-guide pages (alarms, reports, white-labeling, profile-management, metadata, users-quick-start — prior agents flagged specific known-stale files: `img/users-guide/group-client*`, `group-clients-create`, `group-channel-connections`, `janedoe-domainshome`, `jdoe-create-domain`, `img/white-labeling/branding-applied-sidebar`, `branding-collapsed-sidebar`). Same recovery method as above — `git show <branch>:<path> | grep -oE '!\[[^]]*\]\([^)]+\)'` on each `.mdx` file gives the authoritative current list; don't rely on any agent's prose manifest over the actual doc source, since doc content may have shifted since those manifests were written.

Rules Engine, Messaging, and Message Views are now captured (see the pass 2 sections below) — remove them from any future "not reached" list.

## UI surprises worth flagging

- The `Client Key` field label persists at the **DOM accessible-name level** inside the Device/Gateway configuration forms (`textbox "Client Key"`), even though the visible label text says "Device Key" — matches the devices agent's finding, confirmed independently here.
- `/workspace/{id}/gateways` is a filtered view of the same Devices table (identical columns, "Search Device" placeholder, same empty-state copy) — confirms the gateways agent's model that a Gateway is not a separate entity type, just `is_gateway=true` on a Device. The Gateways page's own "Create" dialog omits the `Gateway mode` toggle and the "Gateways" (uplink) combobox that the plain Devices create dialog shows — it's implicitly pre-set.
- Gateway's Devices tab literally displays copy: "Declared and observed — each device's status reflects whether it has actually been heard from, not just whether it was commissioned here." — real, verified in-product language worth quoting directly in the docs if not already.

---

# Pass 2

Continuation of the same capture effort, same branch/account/fixtures as pass 1 unless noted. Scope for this pass, in priority order: (1) finish Devices/Channels/Groups, (2) Rules Engine, (3) Messaging + Message Views. **Dashboards were explicitly dropped from scope mid-pass** — see the "Out of scope — Dashboards" section above for why; do not read that as "ran out of time."

## Pass 2 — Devices / Channels / Groups completion (`docs/latest-devices`)

`devices.mdx` 22/23, `channels.mdx` 27/29, `groups.mdx` 24/24 (73 files total in this folder, 8 of which were already itemized in pass 1's table above — the other 65 are new this pass). All files live at `.tmp/docs-screenshots/latest/devices/*.png`, R2 destination `docs/magistrala/img/devices/<same-name>.png`.

**3 images permanently blocked in this environment** — all three require a second workspace member account to demonstrate a role-members-list with an entry to remove, and only `johnDoe` was available:

- `client-delete-role-members.png` (devices.mdx)
- `channel-members-unassign.png` (channels.mdx)
- `channel-role-member-delete.png` (channels.mdx)

Publish commands (all 73 captured files):

```bash
pnpm run publish-image .tmp/docs-screenshots/latest/devices/assign-group-channels.png docs/magistrala/img/devices/assign-group-channels.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/assign-group-clients.png docs/magistrala/img/devices/assign-group-clients.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-assign-member.png docs/magistrala/img/devices/channel-assign-member.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-audit-action-button.png docs/magistrala/img/devices/channel-audit-action-button.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-connect-client.png docs/magistrala/img/devices/channel-connect-client.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-connections.png docs/magistrala/img/devices/channel-connections.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-create-buttons.png docs/magistrala/img/devices/channel-create-buttons.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-create.png docs/magistrala/img/devices/channel-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-create-role-dialog.png docs/magistrala/img/devices/channel-create-role-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-create-role.png docs/magistrala/img/devices/channel-create-role.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-delete.png docs/magistrala/img/devices/channel-delete.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-disc-client-dialog.png docs/magistrala/img/devices/channel-disc-client-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-disc-client.png docs/magistrala/img/devices/channel-disc-client.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-logs.png docs/magistrala/img/devices/channel-logs.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-members.png docs/magistrala/img/devices/channel-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-metadata.png docs/magistrala/img/devices/channel-metadata.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-role-add-actions.png docs/magistrala/img/devices/channel-role-add-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-role-add-members.png docs/magistrala/img/devices/channel-role-add-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-role-delete-actions.png docs/magistrala/img/devices/channel-role-delete-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-role-delete-members.png docs/magistrala/img/devices/channel-role-delete-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-role-update.png docs/magistrala/img/devices/channel-role-update.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channels-bulk-create.png docs/magistrala/img/devices/channels-bulk-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-settings.png docs/magistrala/img/devices/channel-settings.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/channel-view.png docs/magistrala/img/devices/channel-view.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-alarms.png docs/magistrala/img/devices/client-alarms.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-audit-action-button.png docs/magistrala/img/devices/client-audit-action-button.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-audit-logs.png docs/magistrala/img/devices/client-audit-logs.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-configuration.png docs/magistrala/img/devices/client-configuration.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-connect-channel.png docs/magistrala/img/devices/client-connect-channel.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-connections.png docs/magistrala/img/devices/client-connections.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-create-buttons.png docs/magistrala/img/devices/client-create-buttons.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-create.png docs/magistrala/img/devices/client-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-delete.png docs/magistrala/img/devices/client-delete.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-disc-channel-dialog.png docs/magistrala/img/devices/client-disc-channel-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-disc-channel.png docs/magistrala/img/devices/client-disc-channel.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-members.png docs/magistrala/img/devices/client-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-metadata.png docs/magistrala/img/devices/client-metadata.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-role-create.png docs/magistrala/img/devices/client-role-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-role-delete-actions.png docs/magistrala/img/devices/client-role-delete-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-roles.png docs/magistrala/img/devices/client-roles.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-role-update-members.png docs/magistrala/img/devices/client-role-update-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/clients-bulk-create.png docs/magistrala/img/devices/clients-bulk-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/clients-delete-all-role-members-dialog.png docs/magistrala/img/devices/clients-delete-all-role-members-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-update-role-actions.png docs/magistrala/img/devices/client-update-role-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-update-role.png docs/magistrala/img/devices/client-update-role.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/client-view.png docs/magistrala/img/devices/client-view.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/download-messages.png docs/magistrala/img/devices/download-messages.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/empty-messages-page.png docs/magistrala/img/devices/empty-messages-page.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/filter-panel.png docs/magistrala/img/devices/filter-panel.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-add-parent.png docs/magistrala/img/devices/group-add-parent.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-asssign-member.png docs/magistrala/img/devices/group-asssign-member.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-channels.png docs/magistrala/img/devices/group-channels.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-clients.png docs/magistrala/img/devices/group-clients.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-create-button.png docs/magistrala/img/devices/group-create-button.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-create-with-parent.png docs/magistrala/img/devices/group-create-with-parent.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-delete.png docs/magistrala/img/devices/group-delete.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-disabled.png docs/magistrala/img/devices/group-disabled.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-information.png docs/magistrala/img/devices/group-information.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-metadata.png docs/magistrala/img/devices/group-metadata.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-remove-parent.png docs/magistrala/img/devices/group-remove-parent.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-role-actions.png docs/magistrala/img/devices/group-role-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-role-create.png docs/magistrala/img/devices/group-role-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-role-delete-actions.png docs/magistrala/img/devices/group-role-delete-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-role-delete-members.png docs/magistrala/img/devices/group-role-delete-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-role-members-add.png docs/magistrala/img/devices/group-role-members-add.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-role-update.png docs/magistrala/img/devices/group-role-update.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/groups-audit-logs.png docs/magistrala/img/devices/groups-audit-logs.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/groups-bulk-create.png docs/magistrala/img/devices/groups-bulk-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-settings.png docs/magistrala/img/devices/group-settings.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-share.png docs/magistrala/img/devices/group-share.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/group-update-view.png docs/magistrala/img/devices/group-update-view.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/messages-table.png docs/magistrala/img/devices/messages-table.png
pnpm run publish-image .tmp/docs-screenshots/latest/devices/send-messages.png docs/magistrala/img/devices/send-messages.png
```

New fixtures created this pass: Rules Engine rule **"Store Telemetry Messages"** (Channel Subscriber → Lua pass-through Code Editor → Internal DB/SenML output, on Telemetry Channel) — this is what makes `messages-table.png` and `send-messages.png` possible, since a sent message only appears in a channel's Messages table once a rule persists it. Groups **"Site"** / **"Zone A"** were created fresh because the pre-existing "Sensors" group got stuck disabled (see UI surprises).

## Pass 2 — Rules Engine (`docs/latest-user-guide`, `content/docs/user-guide/rules-engine/overview.mdx`)

35 of 36 referenced images captured (the 36th, `alarm-rule.png`, lives in `img/alarms/` and belongs to `alarms.mdx`, out of scope this pass). 1 blocked for the same reason as the devices/channels blockers above.

**Blocked:** `rule-delete-role-members.png` — needs a second workspace member to populate a role's member list before removing one; only `johnDoe` was available in this environment.

Two fixture rules exist in the workspace now:
- **"Store Telemetry Messages"** — Channel Subscriber (Telemetry Channel) → Code Editor (Lua pass-through) → Internal DB. Kept as a working, saved rule; this is the one feeding the Messages table/views used elsewhere.
- **"High Temperature Alert"** — Channel Subscriber (Telemetry Channel) → Comparison Block (`message.payload.v` > `30`) → Channel Publisher. Built specifically to exercise every output-node type and the Code Editor's Lua/Go toggle for screenshots (Channel Publisher, E-Mail, PostgreSQL, Slack, Internal DB were each added to the canvas in turn — a rule allows up to 3 output nodes at once, so nodes were swapped out via delete once captured). Saved as a real rule via the "Save Rule" dialog (captured as `create-rule-dialog.png`); left enabled in the rules list.

Publish commands:

```bash
pnpm run publish-image .tmp/docs-screenshots/latest/rules/add-multiple-conditions.png docs/magistrala/img/rules/add-multiple-conditions.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/comparison-node.png docs/magistrala/img/rules/comparison-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/create-rule-dialog.png docs/magistrala/img/rules/create-rule-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/disable-rule.png docs/magistrala/img/rules/disable-rule.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/disable-rule-toggle.png docs/magistrala/img/rules/disable-rule-toggle.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/email-node.png docs/magistrala/img/rules/email-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/email-variables.png docs/magistrala/img/rules/email-variables.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/go-editor-node.png docs/magistrala/img/rules/go-editor-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/input-node2.png docs/magistrala/img/rules/input-node2.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/input-node3.png docs/magistrala/img/rules/input-node3.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/input-variables.png docs/magistrala/img/rules/input-variables.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/internal-db-rule.png docs/magistrala/img/rules/internal-db-rule.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/json-input.png docs/magistrala/img/rules/json-input.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/lua-editor-node.png docs/magistrala/img/rules/lua-editor-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/output-node.png docs/magistrala/img/rules/output-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/postgres-node.png docs/magistrala/img/rules/postgres-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/postgres-variables.png docs/magistrala/img/rules/postgres-variables.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/publisher-node.png docs/magistrala/img/rules/publisher-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/publisher-variables.png docs/magistrala/img/rules/publisher-variables.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/quick-links.png docs/magistrala/img/rules/quick-links.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-delete-all-role-members.png docs/magistrala/img/rules/rule-delete-all-role-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-delete.png docs/magistrala/img/rules/rule-delete.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-members.png docs/magistrala/img/rules/rule-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule.png docs/magistrala/img/rules/rule.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-role-create.png docs/magistrala/img/rules/rule-role-create.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-role-delete-actions.png docs/magistrala/img/rules/rule-role-delete-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-roles.png docs/magistrala/img/rules/rule-roles.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rules.png docs/magistrala/img/rules/rules.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-update-role-actions.png docs/magistrala/img/rules/rule-update-role-actions.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-update-role-members.png docs/magistrala/img/rules/rule-update-role-members.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/rule-update-role.png docs/magistrala/img/rules/rule-update-role.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/scheduler.png docs/magistrala/img/rules/scheduler.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/slack-node.png docs/magistrala/img/rules/slack-node.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/slack-variables.png docs/magistrala/img/rules/slack-variables.png
pnpm run publish-image .tmp/docs-screenshots/latest/rules/toggle-script-nodes.png docs/magistrala/img/rules/toggle-script-nodes.png
```

Note: `rule.png` is also reused for the `internal-db-rule.png` and "Storage with senml input" references per the doc source (same underlying screenshot, multiple alt-text captions) — `internal-db-rule.png` is a literal file copy of `rule.png`, not a separate capture.

## Pass 2 — Messaging (`docs/latest-user-guide`, `content/docs/user-guide/messaging.mdx`)

All 12 referenced images captured — this folder is **complete**.

Publish commands:

```bash
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/click-cli-tools-button.png docs/magistrala/img/messaging/click-cli-tools-button.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/coap-cli.png docs/magistrala/img/messaging/coap-cli.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/http-cli.png docs/magistrala/img/messaging/http-cli.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/mqtt-cli.png docs/magistrala/img/messaging/mqtt-cli.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/select-channel-page.png docs/magistrala/img/messaging/select-channel-page.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/select-message-tab.png docs/magistrala/img/messaging/select-message-tab.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/select-send-message-button.png docs/magistrala/img/messaging/select-send-message-button.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/send-message-modal.png docs/magistrala/img/messaging/send-message-modal.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/view-a-channel-page.png docs/magistrala/img/messaging/view-a-channel-page.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/view-channel-page.png docs/magistrala/img/messaging/view-channel-page.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/view-messages-page.png docs/magistrala/img/messaging/view-messages-page.png
pnpm run publish-image .tmp/docs-screenshots/latest/messaging/ws-cli.png docs/magistrala/img/messaging/ws-cli.png
```

Note: the MQTT/CoAP/WS/HTTP CLI command screenshots show a real, live-generated device secret for the **Temperature Sensor** fixture (e.g. `7b2b2643-fc21-4b69-8789-5cfe17d87b3a`) because that's what the "Use CLI Tools" panel actually renders for a real publisher selection — this is fixture/demo data on a local dev instance, not a login credential, and is consistent with how the UI's own device-detail screens already expose client secrets elsewhere in this doc set.

## Pass 2 — Message Views (`docs/latest-user-guide`, `content/docs/user-guide/message-views.mdx`)

5 of 7 referenced images captured. 2 blocked by an environment limitation (not a per-item edge case like the role-member blockers above — a whole feature path is unavailable in this build).

**Blocked:** `json-view-populated.png`, `json-payload-viewer.png` — both require real JSON-format messages in a channel, which requires a Rules Engine **Internal DB (JSON)** output node per the doc's own prerequisites section. This build's "Select an output type" dialog only offers **Internal DB** (SenML) — there is no separate "Internal DB (JSON)" option to select, so there's no way to get a JSON-format message persisted through this UI to populate the Diagnostics view or open its payload viewer. This is a build/deployment gap, not something a workaround can route around; flagging for whoever owns environment setup.

Publish commands:

```bash
pnpm run publish-image .tmp/docs-screenshots/latest/message-views/all-messages-tab.png docs/magistrala/img/message-views/all-messages-tab.png
pnpm run publish-image .tmp/docs-screenshots/latest/message-views/edit-view-dialog.png docs/magistrala/img/message-views/edit-view-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/message-views/new-json-view-dialog.png docs/magistrala/img/message-views/new-json-view-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/message-views/new-senml-view-dialog.png docs/magistrala/img/message-views/new-senml-view-dialog.png
pnpm run publish-image .tmp/docs-screenshots/latest/message-views/senml-view-populated.png docs/magistrala/img/message-views/senml-view-populated.png
```

New fixtures: message views **"Temperature Readings"** (SenML, filtered to Temperature Sensor) and **"Diagnostics"** (JSON, with a `diagnostics.flags.maintenance_due` dot-notation custom column) on the Telemetry Channel — both left saved. "Temperature Readings" is populated (2 real messages); "Diagnostics" is empty since no JSON writer path exists in this environment (see blocked note above) — that empty state is itself an accurate representation of what the doc describes for an undeployed JSON writer.

## Pass 2 — UI surprises worth flagging

- **Role-with-zero-actions bug, confirmed again**: creating a role with no actions selected shows a "created successfully" toast but the role never appears in the roles list, even after reload. Same bug as pass 1 found in devices/channels/groups; reconfirmed here for rules roles too. Workaround used throughout: always select at least one action before clicking Create.
- **Destructive Value Card edit bug (dashboards, found before scope change dropped that area)**: opening "Update Value Card" on an existing dashboard widget threw `Error: An unexpected response was received from the server` for the Channel/Device fields; closing the dialog and reloading logged the session out entirely; after re-authenticating, the widget was permanently gone. This is a genuine product bug, not a self-inflicted mistake — flagging clearly since it will block any future dashboard-screenshot pass until fixed or worked around.
- **Disabled Group gets stuck**: toggling a group's Status to Disabled from its own detail page leaves the Status switch itself (and Edit/Add Parent/Share/Delete) permanently disabled on that same page — no in-UI path back to Enabled. Worked around by leaving the pre-existing "Sensors" group alone (harmless, inert) and creating fresh "Site"/"Zone A" groups for screenshots needing an editable, enabled group.
- **"Invalid entity type" search failures recur across unrelated flows**: the same autocomplete/search-returns-nothing bug from pass 1 (channel connect dialogs, group assign dialogs) also hit the Send Message dialog's Publisher search and the Unit search — typing into the search box returns an empty `listbox` in the accessibility tree even though the underlying `cmdk` DOM list actually has matching items rendered (confirmed via `evaluate_script` reading `[role="listbox"]` textContent directly, then dispatching synthetic mouse events on the `[data-slot="command-item"]` node to select it). Root cause still unconfirmed; the accessibility-tree/synthetic-click workaround is reliable wherever it recurs.
- **React Flow "Add Output" caps at 3 output nodes per rule**: once a rule has an Input, a Logic node, and 3 Output nodes, `Add Output` becomes disabled — confirmed by adding Channel Publisher + E-Mail + PostgreSQL and watching the button grey out, then re-enabling it by deleting one. `Add Input` and `Add Logic` are hard-capped at 1 each (button disables the instant one exists). Useful to know for anyone else scripting rule-canvas screenshots: you don't need a fresh rule per output type, just delete-and-replace on a shared canvas.
- **Rules Engine "Internal DB (JSON)" output type is documented but not present in this build**: `content/docs/user-guide/rules-engine/overview.mdx` and `message-views.mdx` both reference a distinct **Internal DB (JSON)** output node (separate from **Internal DB**/SenML), but the live "Select an output type" dialog in this environment only lists: Channel Publisher, Alarm, E-Mail, PostgreSQL, Internal DB, Slack. No JSON variant exists to select. This directly blocks `json-view-populated.png` and `json-payload-viewer.png` in message-views.mdx — see that section above.
