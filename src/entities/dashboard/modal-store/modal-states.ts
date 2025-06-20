import { GetConfigProfilesCommand, GetInternalSquadsCommand } from '@remnawave/backend-contract'

export const MODALS = {
    CONFIG_PROFILES_SHOW_ACTIVE_NODE: 'CONFIG_PROFILES_SHOW_ACTIVE_NODE',
    INTERNAL_SQUAD_SHOW_INBOUNDS: 'INTERNAL_SQUAD_SHOW_INBOUNDS',
    USER_ACCESSIBLE_NODES_DRAWER: 'USER_ACCESSIBLE_NODES_DRAWER'
} as const

export interface ModalInternalStates {
    CONFIG_PROFILES_SHOW_ACTIVE_NODE: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['nodes']
    INTERNAL_SQUAD_SHOW_INBOUNDS: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    USER_ACCESSIBLE_NODES_DRAWER: {
        userUuid: string
    }
}
