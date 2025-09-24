import ReactCountryFlag from 'react-country-flag'
import { Group, Text } from '@mantine/core'

import { IProps } from './interface'

export function ConnectedNodeColumnEntity(props: IProps) {
    const { lastConnectedNode } = props

    return (
        <Group
            align="center"
            gap="sm"
            style={{
                flex: 1,
                minWidth: 0
            }}
            wrap="nowrap"
        >
            {lastConnectedNode?.countryCode && lastConnectedNode.countryCode !== 'XX' && (
                <ReactCountryFlag
                    countryCode={lastConnectedNode.countryCode}
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )}
            <Text ff="monospace" fw={500} size="md">
                {lastConnectedNode?.nodeName || '–'}
            </Text>
        </Group>
    )
}
