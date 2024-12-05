import { Badge, Checkbox, Group, Text } from '@mantine/core'

import classes from './Checkbox.module.css'
import { IProps } from './interfaces'

export function InboundCheckboxCardWidget(props: IProps) {
    const { inbound } = props
    return (
        <Checkbox.Card className={classes.root} key={inbound.uuid} radius="md" value={inbound.uuid}>
            <Group align="flex-start" gap="xs" key={`${inbound.uuid}-group`}>
                <Checkbox.Indicator key={`${inbound.uuid}-indicator`} />
                <div key={`${inbound.uuid}-div`}>
                    <Text
                        className={classes.label}
                        key={`${inbound.uuid}-label`}
                        size="sm"
                        truncate="end"
                    >
                        {inbound.tag}
                    </Text>
                    <Badge color="gray" key={`${inbound.uuid}-badge`} size="xs" variant="outline">
                        {inbound.type}
                    </Badge>
                </div>
            </Group>
        </Checkbox.Card>
    )
}
