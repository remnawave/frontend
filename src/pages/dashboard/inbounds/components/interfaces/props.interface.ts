import {
    GetAllInboundsCommand,
    GetConfigProfilesCommand,
    GetNodesCommand
} from '@remnawave/backend-contract'

export interface Props {
    inbounds: GetAllInboundsCommand.Response['response']['inbounds']
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    nodes: GetNodesCommand.Response['response']
}
