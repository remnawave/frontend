import type { InputBaseProps } from '@mantine/core'

import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps extends InputBaseProps {
    nodes: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['nodes']
}
