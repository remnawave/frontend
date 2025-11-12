import ReactCountryFlag from 'react-country-flag'
import { Group, Text } from '@mantine/core'

import { IProps } from './interface'

export function ConnectedNodeColumnEntity(props: IProps) {
    const { node } = props

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
            {node?.countryCode && node.countryCode !== 'XX' && (
                <ReactCountryFlag
                    countryCode={node.countryCode}
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )}
            <Text ff="monospace" fw={500} size="md">
                {node?.name || '–'}
            </Text>
        </Group>
    )
}
