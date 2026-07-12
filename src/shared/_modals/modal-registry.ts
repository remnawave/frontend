import type { ComponentProps } from 'react'

import NiceModal from '@ebay/nice-modal-react'

import { ConfigProfileInboundsDrawer, ActiveNodesModal } from './config-profiles'
import { ExternalSquadsDrawer } from './external-squads'
import {
    CreateHostDrawer,
    EditHostDrawer,
    EditManyHostsDrawer,
    HostsConfigProfilesDrawer
} from './hosts'
import {
    CreateInfraBillingNodeModal,
    CreateInfraBillingRecordModal,
    CreateInfraProviderModal,
    UpdateBillingDateModal,
    ViewInfraProviderModal
} from './infra-billing'
import {
    InternalSquadAccessibleNodesDrawer,
    InternalSquadsInboundsDrawer,
    InternalSquadsUsageDrawer
} from './internal-squads'
import { NodePluginExecutorDrawer } from './node-plugins'
import {
    CreateNodeModal,
    EditNodeModal,
    LinkedHostsDrawer,
    NodeActiveSessionsDrawer,
    NodesConfigProfilesDrawer,
    NodesUsageStatsModal,
    NodeUsageStatsDrawer
} from './nodes'
import { PasskeysDrawer } from './remnawave-settings'
import { CreateModal, HelpDrawerShared, RenameModalShared } from './universal'
import {
    DetailedUserInfoDrawer,
    ViewUserModal,
    UserAccessibleNodesModal,
    CreateUserModal,
    UserUsageModal,
    UserTorrentBlockerReportsModal,
    SubscriptionQrCodeModal,
    ConnectionKeysDrawer,
    UserSubscriptionRequestsModal,
    UserHwidDevicesModal,
    UserActiveSessionDrawer,
    BulkManyUsersActionsModal,
    BulkManyUsersUpdateModal,
    BulkAllUsersActionsModal,
    BulkAllUsersUpdateModal
} from './users'

export const MODAL_REGISTRY = {
    helpDrawer: HelpDrawerShared,
    renameModal: RenameModalShared,
    createModal: CreateModal,

    users_viewUserModal: ViewUserModal,
    users_detailedUserInfoDrawer: DetailedUserInfoDrawer,
    users_userAccessibleNodesModal: UserAccessibleNodesModal,
    users_createUserModal: CreateUserModal,
    users_userUsageModal: UserUsageModal,
    users_userTorrentBlockerReportsModal: UserTorrentBlockerReportsModal,
    users_connectionKeysDrawer: ConnectionKeysDrawer,
    users_subscriptionQrCodeModal: SubscriptionQrCodeModal,
    users_userSubscriptionRequestsModal: UserSubscriptionRequestsModal,
    users_userHwidDevicesModal: UserHwidDevicesModal,
    users_userActiveSessionDrawer: UserActiveSessionDrawer,
    users_bulkManyUsersActionsModal: BulkManyUsersActionsModal,
    users_bulkManyUsersUpdateModal: BulkManyUsersUpdateModal,
    users_bulkAllUsersActionsModal: BulkAllUsersActionsModal,
    users_bulkAllUsersUpdateModal: BulkAllUsersUpdateModal,

    nodes_createNodeModal: CreateNodeModal,
    nodes_editNodeModal: EditNodeModal,
    nodes_nodeUsageStatsDrawer: NodeUsageStatsDrawer,
    nodes_nodesUsageStatsModal: NodesUsageStatsModal,
    nodes_linkedHostsDrawer: LinkedHostsDrawer,
    nodes_nodeActiveSessionsDrawer: NodeActiveSessionsDrawer,
    nodes_nodesConfigProfilesDrawer: NodesConfigProfilesDrawer,

    internalSquads_internalSquadsInboundsDrawer: InternalSquadsInboundsDrawer,
    internalSquads_internalSquadAccessibleNodesDrawer: InternalSquadAccessibleNodesDrawer,
    internalSquads_internalSquadsUsageDrawer: InternalSquadsUsageDrawer,

    externalSquads_externalSquadsDrawer: ExternalSquadsDrawer,

    configProfiles_activeNodesModal: ActiveNodesModal,
    configProfiles_configProfileInboundsDrawer: ConfigProfileInboundsDrawer,

    nodePlugins_nodePluginExecutorDrawer: NodePluginExecutorDrawer,

    infraBilling_viewInfraProviderModal: ViewInfraProviderModal,
    infraBilling_createInfraProviderModal: CreateInfraProviderModal,
    infraBilling_createInfraBillingNodeModal: CreateInfraBillingNodeModal,
    infraBilling_createInfraBillingRecordModal: CreateInfraBillingRecordModal,
    infraBilling_updateBillingDateModal: UpdateBillingDateModal,

    hosts_createHostDrawer: CreateHostDrawer,
    hosts_editHostDrawer: EditHostDrawer,
    hosts_editManyHostsDrawer: EditManyHostsDrawer,
    hosts_hostsConfigProfilesDrawer: HostsConfigProfilesDrawer,

    rwSettings_passkeysDrawer: PasskeysDrawer
} as const

Object.entries(MODAL_REGISTRY).forEach(([id, Cmp]) => NiceModal.register(id, Cmp))

type Registry = typeof MODAL_REGISTRY
export type ModalId = keyof Registry

export type ModalArgs<K extends ModalId> = Omit<ComponentProps<Registry[K]>, 'id' | 'keepMounted'>
