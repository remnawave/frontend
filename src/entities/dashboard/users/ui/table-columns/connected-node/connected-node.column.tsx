import { Text } from '@mantine/core'

import { IProps } from './interface'

export function ConnectedNodeColumnEntity(props: IProps) {
    const { nodeName } = props

    return (
        <Text ff="monospace" fw={500} size="lg">
            {nodeName || '–'}
        </Text>
    )
}
