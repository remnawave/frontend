import type { InputBaseProps } from '@mantine/core'

import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps extends InputBaseProps {
    allInbounds: Array<{
        inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
        profileConfig?: object
        profileName: string
    }>
    filterType: 'all' | 'selected' | 'unselected'
    onInboundToggle: (
        inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
    ) => void
    selectedInbounds: Set<string>
}
