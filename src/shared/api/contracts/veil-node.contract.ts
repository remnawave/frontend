// Inline contract extension that adds the `core: 'XRAY' | 'VEIL'`
// field to the Create/Update node request schemas.
//
// Why this lives here:
//   @remnawave/backend-contract@2.7.2 (the version pinned by this
//   branch) ships the legacy XRAY-only schemas. The matching backend
//   PR (remnawave/backend#168) adds the column and accepts the field
//   on the wire, but until a new backend-contract release is published
//   to npm the frontend has nothing to import.
//
// MIGRATION: once @remnawave/backend-contract publishes a release that
// includes `NodeCore`, replace every import of
// `CreateVeilAwareNodeCommand` / `UpdateVeilAwareNodeCommand` with
// `CreateNodeCommand` / `UpdateNodeCommand` from the package and
// delete this file.

import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { z } from 'zod'

import { DEFAULT_NODE_CORE, NODE_CORE } from '@shared/constants/veil'

const NodeCoreSchema = z
    .enum([NODE_CORE.XRAY, NODE_CORE.VEIL] as const)
    .default(DEFAULT_NODE_CORE)

export const CreateVeilAwareNodeRequestSchema = CreateNodeCommand.RequestSchema.extend({
    core: NodeCoreSchema,
})

export type CreateVeilAwareNodeRequest = z.infer<typeof CreateVeilAwareNodeRequestSchema>;

export const UpdateVeilAwareNodeRequestSchema = UpdateNodeCommand.RequestSchema.extend({
    core: NodeCoreSchema.optional(),
})

export type UpdateVeilAwareNodeRequest = z.infer<typeof UpdateVeilAwareNodeRequestSchema>;
