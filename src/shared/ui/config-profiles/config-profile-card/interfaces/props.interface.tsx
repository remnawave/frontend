import type { InputBaseProps } from '@mantine/core'

import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps extends InputBaseProps {
    isOpen: boolean
    onInboundToggle: (
        inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
    ) => void
    onSelectAllInbounds: (profileUuid: string) => void
    onUnselectAllInbounds: (profileUuid: string) => void
    profile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    selectedInbounds: Set<string>
}
