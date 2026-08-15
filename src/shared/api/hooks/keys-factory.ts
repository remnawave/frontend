import { inferQueryKeyStore, mergeQueryKeys } from '@lukemorales/query-key-factory'

import { apiTokensQueryKeys } from './api-tokens/api-tokens.query.hooks'
import { authQueryKeys } from './auth/auth.query.hooks'
import { bandwidthStatsQueryKeys } from './bandwidth-stats/bandwidth-stats.query.hooks'
import { configProfilesQueryKeys } from './config-profiles/config-profiles.query.hooks'
import { connectionsQueryKeys } from './connections/connections.query.hooks'
import { externalSquadsQueryKeys } from './external-squads/external-squads.query.hooks'
import { hostsQueryKeys } from './hosts/hosts.query.hooks'
import { hwidUserDevicesQueryKeys } from './hwid-user-devices/hwid-user-devices.query.hooks'
import { infraBillingQueryKeys } from './infra-billing/infra-billing.query.hooks'
import { internalSquadsQueryKeys } from './internal-squads/internal-squads.query.hooks'
import { nodeIntegrationsQueryKeys } from './node-integrations/node-integrations.query.hooks'
import { nodePluginsQueryKeys } from './node-plugins/node-plugins.query.hooks'
import { nodesQueryKeys } from './nodes/nodes.query.hooks'
import { passkeysQueryKeys } from './passkeys/passkeys.query.hooks'
import { remnawaveSettingsQueryKeys } from './remnawave-settings/remnawave-settings.query.hooks'
import { snippetsQueryKeys } from './snippets/snippets.query.hooks'
import { subpageConfigsQueryKeys } from './subpage-configs/subpage-configs.query.hooks'
import { subscriptionRequestHistoryQueryKeys } from './subscription-request-history/subscription-request-history.query.hooks'
import { subscriptionSettingsQueryKeys } from './subscription-settings/subscription-settings.query.hooks'
import { subscriptionTemplateQueryKeys } from './subscription-template/subscription-template.query.hooks'
import { systemQueryKeys } from './system/system.query.hooks'
import { usersQueryKeys } from './users/users.query.hooks'

export const QueryKeys = mergeQueryKeys(
    usersQueryKeys,
    systemQueryKeys,
    hostsQueryKeys,
    nodesQueryKeys,
    apiTokensQueryKeys,
    authQueryKeys,
    subscriptionTemplateQueryKeys,
    subscriptionSettingsQueryKeys,
    hwidUserDevicesQueryKeys,
    configProfilesQueryKeys,
    internalSquadsQueryKeys,
    infraBillingQueryKeys,
    subscriptionRequestHistoryQueryKeys,
    snippetsQueryKeys,
    externalSquadsQueryKeys,
    remnawaveSettingsQueryKeys,
    passkeysQueryKeys,
    subpageConfigsQueryKeys,
    bandwidthStatsQueryKeys,
    connectionsQueryKeys,
    nodePluginsQueryKeys,
    nodeIntegrationsQueryKeys
)

export type TQueryKeys = inferQueryKeyStore<typeof QueryKeys>
