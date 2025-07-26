import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { ReactNode } from 'react'

export interface IProps {
    activeConfigProfileInbounds: null | string[] | undefined
    activeConfigProfileUuid: null | string | undefined
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    errors?: ReactNode
    onSaveInbounds: (inbounds: string[], configProfileUuid: string) => void
}
