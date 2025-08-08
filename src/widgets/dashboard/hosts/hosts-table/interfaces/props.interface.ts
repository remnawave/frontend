import {
    GetAllHostsCommand,
    GetAllHostTagsCommand,
    GetConfigProfilesCommand
} from '@remnawave/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    hosts: GetAllHostsCommand.Response['response'] | undefined
    hostTags: GetAllHostTagsCommand.Response['response']['tags'] | undefined
    selectedHosts: string[]
    setSelectedHosts: React.Dispatch<React.SetStateAction<string[]>>
}
