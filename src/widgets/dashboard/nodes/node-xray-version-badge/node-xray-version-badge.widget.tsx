import { Badge, Group } from '@mantine/core'
import { memo } from 'react'

import { XrayLogo } from '@shared/ui/logos'

import { IProps } from './interface'

export const NodeXrayVersionBadgeWidget = memo(({ node, fetchedNode, ...rest }: IProps) => {
    const nodeData = fetchedNode || node

    return (
        <Group>
            <Badge color="grape" leftSection={<XrayLogo size={18} />} size="lg" {...rest}>
                {nodeData.xrayVersion ?? 'unknown'}
            </Badge>
        </Group>
    )
})
