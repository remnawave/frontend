import { Badge, Group } from '@mantine/core'

import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import { IProps } from './interface'

export function NodeXrayVersionBadgeWidget({ node, fetchedNode, ...rest }: IProps) {
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
}
