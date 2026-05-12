// Node core flavours. Mirrors the `Nodes.core` enum that the panel-side
// PR adds (remnawave/backend#168) and the controller surface that
// remnawave/node#38 exposes under `/node/veil/*`.
//
// Lives client-side because @remnawave/backend-contract@2.7.2 (the
// version this branch pins) doesn't yet ship `NodeCore`; once the
// backend release that does is published, swap the imports here for
// the upstream schema and delete this file.

export const NODE_CORE = {
    XRAY: 'XRAY',
    VEIL: 'VEIL',
} as const

export type TNodeCore = (typeof NODE_CORE)[keyof typeof NODE_CORE];

export const NODE_CORE_VALUES: TNodeCore[] = [NODE_CORE.XRAY, NODE_CORE.VEIL]

export const DEFAULT_NODE_CORE: TNodeCore = NODE_CORE.XRAY

// Human-friendly labels surfaced in the Mantine `Select`. Kept here so
// the create + edit forms stay in lock-step.
export const NODE_CORE_LABELS: Record<TNodeCore, string> = {
    XRAY: 'Xray-core',
    VEIL: 'Veil (pre-alpha)',
}
