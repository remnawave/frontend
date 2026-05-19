import { GetAllHostsCommand, GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    hosts: GetAllHostsCommand.Response['response'] | undefined
    moveSelected: (mode: 'bottom' | 'down' | 'top' | 'up') => void
    selectedHosts: string[]
    setSelectedHosts: (hosts: string[]) => void
}
