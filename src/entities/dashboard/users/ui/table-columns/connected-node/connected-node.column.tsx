import { Badge, Text } from '@mantine/core'

import { IProps } from './interface'

export function ConnectedNodeColumnEntity(props: IProps) {
    const { nodeName } = props

    return (
        <>
            {nodeName ? (
                <Badge color="gray" size="lg" variant="outline">
                    {nodeName}
                </Badge>
            ) : (
                <Text c="dimmed" size="lg">
                    –
                </Text>
            )}
        </>
    )
}
