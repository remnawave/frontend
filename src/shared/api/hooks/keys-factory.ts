import { inferQueryKeyStore, mergeQueryKeys } from '@lukemorales/query-key-factory'

import { apiTokensQueryKeys } from './api-tokens/api-tokens.query.hooks'
import { systemQueryKeys } from './system/system.query.hooks'
import { inboundsQueryKeys } from './inbounds/inbounds.query'
import { configQueryKeys } from './config/config.query.hooks'
import { usersQueryKeys } from './users/users.query.hooks'
import { hostsQueryKeys } from './hosts/hosts.query.hooks'
import { nodesQueryKeys } from './nodes/nodes.query.hooks'

export const QueryKeys = mergeQueryKeys(
    usersQueryKeys,
    systemQueryKeys,
    inboundsQueryKeys,
    hostsQueryKeys,
    nodesQueryKeys,
    configQueryKeys,
    apiTokensQueryKeys
)

export type TQueryKeys = inferQueryKeyStore<typeof QueryKeys>
