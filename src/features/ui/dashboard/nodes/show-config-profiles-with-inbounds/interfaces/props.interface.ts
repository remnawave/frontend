import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps {
    activeConfigProfileInbounds: null | string[] | undefined
    activeConfigProfileUuid: null | string | undefined
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    onSaveInbounds: (inbounds: string[], configProfileUuid: string) => void
}
