import { Badge, Checkbox, Group, Text } from '@mantine/core'

import classes from './Checkbox.module.css'
import { IProps } from './interfaces'

export function InboundCheckboxCardWidget(props: IProps) {
    const { inbound } = props
    return (
        <Checkbox.Card className={classes.root} key={inbound.uuid} radius="md" value={inbound.uuid}>
            <Group align="flex-start" gap="xs">
                <Checkbox.Indicator />
                <div>
                    <Text className={classes.label} size="sm" truncate="end">
                        {inbound.tag}
                    </Text>
                    <Badge color="gray" size="xs" variant="outline">
                        {inbound.type}
                    </Badge>
                </div>
            </Group>
        </Checkbox.Card>
    )
}
