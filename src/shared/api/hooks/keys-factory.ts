import { inferQueryKeyStore, mergeQueryKeys } from '@lukemorales/query-key-factory'

import { subscriptionTemplateQueryKeys } from './subscription-template/subscription-template.query.hooks'
import { subscriptionSettingsQueryKeys } from './subscription-settings/subscription-settings.query.hooks'
import { apiTokensQueryKeys } from './api-tokens/api-tokens.query.hooks'
import { systemQueryKeys } from './system/system.query.hooks'
import { inboundsQueryKeys } from './inbounds/inbounds.query'
import { configQueryKeys } from './config/config.query.hooks'
import { usersQueryKeys } from './users/users.query.hooks'
import { hostsQueryKeys } from './hosts/hosts.query.hooks'
import { nodesQueryKeys } from './nodes/nodes.query.hooks'
import { authQueryKeys } from './auth/auth.query.hooks'

export const QueryKeys = mergeQueryKeys(
    usersQueryKeys,
    systemQueryKeys,
    inboundsQueryKeys,
    hostsQueryKeys,
    nodesQueryKeys,
    configQueryKeys,
    apiTokensQueryKeys,
    authQueryKeys,
    subscriptionTemplateQueryKeys,
    subscriptionSettingsQueryKeys
)

export type TQueryKeys = inferQueryKeyStore<typeof QueryKeys>
