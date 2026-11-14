# Mesh dashboard

Requires companion backend PR: https://github.com/remnawave/backend/pull/237.

The Mesh page is available under Nodes in both desktop and mobile menus at
`/dashboard/management/mesh`. It preserves the existing mesh dashboard layout:
automation, compact entry/exit link map, quorum health, etcd membership, exit and
relay settings, managed nodes, overlay matrix and decisions/events.

The page uses the panel's authenticated API, never contacts the controller directly
and never receives its shared token. Status refreshes every ten seconds. Operations
are asynchronous; their progress is available in a modal and the operation list.
Closing progress does not cancel the server operation.

Adding a server requires its SSH credential and independently verified host-key
fingerprint. The credential is cleared after the request and is never stored in
local/session storage. A failed SSH fingerprint check cannot authorize a new host.
Only controller-managed nodes can be removed, and etcd members must leave quorum
first. Removing a voter below three asks for confirmation, stops etcd on all
members and retains its data; the mesh remains active using the controller’s
durable local journal. Selecting a third voter resumes etcd and archives old data.
The separate full-removal dialog requires typing `REMOVE_MESH`, shows operation
progress, and supports retrying offline cleanup targets. VPN nodes remain intact.

Unavailable capabilities are disabled. The upstream-only backend has no HAProxy
balancer; its optional external adapter must be explicitly configured to enable
balancer controls. Relay/IP automation additionally requires the controller's panel
API integration. Disabling automatic relays does not undo an existing relay journal.

Russian and English translations are provided; other locales fall back to English.
The map supports keyboard focus and respects reduced-motion preferences.

## Local validation

In a Node 24 Docker container: `npm ci`, `npm run typecheck`, and `npm run start:build`.
The backend's `mesh-controller/lab/prepare_managed.py --frontend-dist <dist-folder>`
starts a loopback-only UI gateway with real WireGuard, SSH and a three-member mTLS
etcd cluster. Through this dashboard, onboarding, learner promotion, voter removal,
node removal, progress reporting and quorum protection were exercised locally.

No production cluster or existing user credentials are needed by that lab.
