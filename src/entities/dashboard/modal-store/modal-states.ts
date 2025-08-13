import {
    GetConfigProfilesCommand,
    GetInfraBillingNodesCommand,
    GetInfraProvidersCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'

export const MODALS = {
    CONFIG_PROFILES_SHOW_ACTIVE_NODE: 'CONFIG_PROFILES_SHOW_ACTIVE_NODE',
    INTERNAL_SQUAD_SHOW_INBOUNDS: 'INTERNAL_SQUAD_SHOW_INBOUNDS',
    USER_ACCESSIBLE_NODES_DRAWER: 'USER_ACCESSIBLE_NODES_DRAWER',
    VIEW_INFRA_PROVIDER_DRAWER: 'VIEW_INFRA_PROVIDER_DRAWER',
    CREATE_INFRA_PROVIDER_DRAWER: 'CREATE_INFRA_PROVIDER_DRAWER',
    CREATE_INFRA_BILLING_RECORD_DRAWER: 'CREATE_INFRA_BILLING_RECORD_DRAWER',
    UPDATE_BILLING_DATE_MODAL: 'UPDATE_BILLING_DATE_MODAL',
    CREATE_INFRA_BILLING_NODE_MODAL: 'CREATE_INFRA_BILLING_NODE_MODAL',
    EDIT_NODE_BY_UUID_MODAL: 'EDIT_NODE_BY_UUID_MODAL',
    SHOW_NODE_USERS_USAGE_DRAWER: 'SHOW_NODE_USERS_USAGE_DRAWER',
    RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL: 'RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL'
} as const

export interface ModalInternalStates {
    CONFIG_PROFILES_SHOW_ACTIVE_NODE: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['nodes']
    CREATE_INFRA_BILLING_NODE_MODAL: undefined
    CREATE_INFRA_BILLING_RECORD_DRAWER: undefined
    CREATE_INFRA_PROVIDER_DRAWER: undefined
    EDIT_NODE_BY_UUID_MODAL: {
        nodeUuid: string
    }
    INTERNAL_SQUAD_SHOW_INBOUNDS: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL: {
        name: string
        uuid: string
    }
    SHOW_NODE_USERS_USAGE_DRAWER: {
        nodeUuid: string
    }
    UPDATE_BILLING_DATE_MODAL: GetInfraBillingNodesCommand.Response['response']['billingNodes'][number]
    USER_ACCESSIBLE_NODES_DRAWER: {
        userUuid: string
    }
    VIEW_INFRA_PROVIDER_DRAWER: GetInfraProvidersCommand.Response['response']['providers'][number]
}
