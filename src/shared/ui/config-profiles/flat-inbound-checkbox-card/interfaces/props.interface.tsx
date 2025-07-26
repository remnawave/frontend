import type { InputBaseProps } from '@mantine/core'

import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps extends InputBaseProps {
    inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
    isSelected: boolean
    onInboundToggle: (
        inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
    ) => void
    profileName: string
}
