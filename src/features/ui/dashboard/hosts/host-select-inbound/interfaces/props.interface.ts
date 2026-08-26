import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { ReactNode } from 'react'

export interface IProps {
    activeConfigProfileInbound: null | string | undefined
    activeConfigProfileUuid: null | string | undefined
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    error?: ReactNode
    onSaveInbound: (inbound: string, configProfileUuid: string) => void
}
