import {
    GetAllHostsCommand,
    GetAllNodesCommand,
    GetConfigProfilesCommand
} from '@remnawave/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    isDragOverlay?: boolean
    isHighlighted?: boolean
    isSelected?: boolean
    item: GetAllHostsCommand.Response['response'][number]
    nodes: GetAllNodesCommand.Response['response']
    onSelect?: () => void
}
