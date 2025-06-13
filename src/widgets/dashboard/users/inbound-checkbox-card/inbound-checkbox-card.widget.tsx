import { Badge, Checkbox, Group, Text } from '@mantine/core'
import { memo } from 'react'

import classes from './Checkbox.module.css'
import { IProps } from './interfaces'

export const InboundCheckboxCardWidget = memo((props: IProps) => {
    const { inbound } = props

    if (!inbound) {
        return null
    }

    return (
        <Checkbox.Card
            className={classes.compactRoot}
            key={inbound.uuid}
            radius="md"
            value={inbound.uuid}
        >
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                    <Checkbox.Indicator size="sm" />
                    <Text className={classes.compactLabel} size="sm" truncate>
                        {inbound.tag}
                    </Text>
                </Group>

                <Group gap="xs" wrap="nowrap">
                    <Badge color="gray" size="xs" variant="outline">
                        {inbound.type}
                    </Badge>
                    <Badge color="teal" size="xs" variant="outline">
                        {inbound.port}
                    </Badge>
                </Group>
            </Group>
        </Checkbox.Card>
    )
})
