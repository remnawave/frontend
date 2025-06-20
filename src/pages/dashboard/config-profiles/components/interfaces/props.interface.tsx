import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface Props {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
}
