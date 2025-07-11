import { GetAllHostsCommand, GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    isDragOverlay?: boolean
    isSelected?: boolean
    item: GetAllHostsCommand.Response['response'][number]
    onSelect?: () => void
}
