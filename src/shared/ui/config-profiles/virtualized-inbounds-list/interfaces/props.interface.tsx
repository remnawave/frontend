import type { InputBaseProps } from '@mantine/core'

import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps extends InputBaseProps {
    onInboundToggle: (
        inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
    ) => void
    profile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    selectedInbounds: Set<string>
}
