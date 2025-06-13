import { Badge, Group } from '@mantine/core'
import { memo } from 'react'

import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import { IProps } from './interface'

export const NodeXrayVersionBadgeWidget = memo(({ node, fetchedNode, ...rest }: IProps) => {
    const nodeData = fetchedNode || node

    return (
        <Group>
            <Badge
                color="grape"
                leftSection={<XtlsLogo height={18} width={18} />}
                size="lg"
                {...rest}
            >
                {nodeData.xrayVersion ?? 'unknown'}
            </Badge>
        </Group>
    )
})
