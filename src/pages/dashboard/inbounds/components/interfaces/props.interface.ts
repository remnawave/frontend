import {
    GetAllInboundsCommand,
    GetConfigProfilesCommand,
    GetInternalSquadsCommand,
    GetNodesCommand
} from '@remnawave/backend-contract'

export interface Props {
    inbounds: GetAllInboundsCommand.Response['response']['inbounds']
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
    nodes: GetNodesCommand.Response['response']
}
