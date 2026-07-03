# UI Audit Findings — Broken/Missing Functionality

Found while updating the user-guide docs against the running UI at `localhost:3000` (self-hosted build, domain creator / `tenant-admin` user). Not pushed into the docs — for reporting to the dev team.

## 1. Alarms — RESOLVED as of the environment rebuild

Originally, both the top-level **Alarms** nav page and every client's **Alarms** tab threw `Error: not authorized to view alarms in domain`, even for the domain creator (`tenant-admin`). After the environment was rebuilt (volumes reset), this no longer reproduces — the Alarms page loads normally with the expected table (Rule, Severity, Status, Cause, Measurement, Value, Threshold, Assignee, Resolved By, Acknowledged By columns). Leaving this here for the record in case it resurfaces; it was consistently reproducible before the rebuild.

## 2. Personal Access Tokens — broken and removed from nav

- The **Personal Access Tokens** entry is gone from the user avatar popover menu (only **Profile**, **Switch Domains**, **Logout** remain).
- Navigating directly to the PATs route fails with:
  ```
  Error: Unexpected token '<', "<html> <h"... is not valid JSON
  ```
  This means the frontend is calling an endpoint that now returns an HTML page (likely a 404) instead of JSON — the route exists in the frontend but its backing API call is broken.

**Impact:** No way to create/manage Personal Access Tokens through the UI.

## 3. Solution Packs — UPDATE: now present and working (environment changed since first pass)

Originally reported as a true 404 with no nav entry at all. After the environment was rebuilt (volumes reset), **Solutions** is now a working nav item at `/domain/:id/solutions`, showing an install catalogue with **Details**/**Install** actions. Four packs are listed:

- Cold Storage Monitoring — **not in the docs at all**, worth a new solution-pack page (tags: cold-storage, refrigeration, food-safety, haccp, temperature-monitoring, energy-management, iot)
- Oil & Gas Field Monitoring (documented)
- Smart Irrigation (documented)
- Smart Water Metering (documented)

Worth re-running the install/detail/instructions flow end-to-end against this rebuilt environment to verify the rest of `user-guide/solution-packs/overview.mdx` (Install, View Details, Uninstall, Instructions tab) before trusting it — this pass only confirmed the catalogue itself renders.

## 3b. Bootstraps — still broken, but now linked in nav

Previously the `/bootstraps` route existed but wasn't linked anywhere. It's now a visible **Bootstraps** nav item (under Clients Management), but navigating to it still fails with `Error: fetch failed` — the backend Bootstrap service still isn't reachable in this environment.

## 4. Dashboard Templates — missing

- No **Dashboard / Template** type switch in the "Create Dashboard" dialog (docs describe one).
- No **All / Dashboards / Templates** filter tabs on the Dashboards listing page.

Templates are described as an enterprise "customer portal" feature (tag-based data sources for multi-user dashboards) — worth confirming whether this is Cloud/plan-gated like Billing (#5) or a regression.

## 5. Billing — missing (may be intentional / Cloud-only)

- No **Billing** nav item under Domain Management.
- No **Usage & Limits** card (with "Manage Billing" link) on the domain Home page — old docs screenshots show both.

The existing docs already note Billing is Magistrala-Cloud-only, so this is plausibly expected for a self-hosted build — flagging for confirmation, not necessarily a bug.

## 6b. Invitations — "Users" search is broken; email-invite path works but shows a spurious error

In the **Send Invitation(s)** dialog, the **Users** search field returns "No user found" for every query tried, including usernames of users known to exist (`andyDoe`, `lucyDoe`, `janeDoe`, and even the substring `Doe`). This makes it impossible to invite by username right now — worth checking the search endpoint this field calls.

The **Email invites** fallback field does work, but the request sometimes reports `{"error":"internal error"}` in the RSC response even though the invitation is actually created (confirmed by reloading the Invitations table and seeing the new Pending row). This looks like a double-submission/race rather than a hard failure — worth checking for a duplicate form-submit handler.

## 6. Profile — Password tab removed

The Profile page previously had three tabs: **Account**, **Password**, **Preferences**. Only **Account** and **Preferences** exist now — no in-app "change password while logged in" flow. The "Forgot Password" email-reset flow from the login page still works as a fallback.

## 7. Rules Engine — Create Rule silently fails to persist

Building a rule in the flow editor (Channel Subscriber input → Comparison Block logic → Alarm output) and clicking **Save Rule** → naming it → **Create** returns a `200` on the `POST .../rules/create` server action every time, and the dialog closes with no visible error toast — but the rule never appears in the Rules list afterward (`No rules found`, checked with the Status filter set to **All**). Reproduced 3 times in a row with slightly different node configurations (including a minimal one: single comparison condition, no schedule, output = Alarm only). Worth checking the rules-service response body server-side, since the frontend has no visibility into why it's failing.

**Impact:** Could not verify the Alarms flow end-to-end (rule → triggered alarm → assignee) in this environment/session — blocked at rule creation.

## Notes on things that are NOT broken (in case useful context)

- Reports, Custom Nodes, Metadata, Domain/Client/Channel/Group Roles, Journals (renamed from Audit Logs) all worked as expected during this pass. Rules Engine node-builder UI (inputs/logic/outputs, auto-connecting edges) works fine — only the final Save/Create step is broken (see #7).
- The new generic Atom-based permission model (read/write/delete/publish/subscribe/manage/role.manage/policy.manage/execute) is consistent across domains, clients, channels, groups, and (inferred, not directly tested) rules.
