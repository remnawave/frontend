import { GetAllHostsCommand, GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    hosts: GetAllHostsCommand.Response['response'] | undefined
    isConfigProfilesLoading: boolean
    isHostsLoading: boolean
}
