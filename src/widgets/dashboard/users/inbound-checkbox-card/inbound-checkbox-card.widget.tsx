import { Badge, Checkbox, Group, Text } from '@mantine/core'
import { IProps } from './interfaces'
import classes from './Checkbox.module.css'

export function InboundCheckboxCardWidget(props: IProps) {
    const { inbound } = props
    return (
        <Checkbox.Card className={classes.root} radius="md" value={inbound.uuid} key={inbound.uuid}>
            <Group align="flex-start" gap="xs">
                <Checkbox.Indicator />
                <div>
                    <Text size="sm" className={classes.label} truncate="end">
                        {inbound.tag}
                    </Text>
                    <Badge variant="outline" size="xs" color="gray">
                        {inbound.type}
                    </Badge>
                </div>
            </Group>
        </Checkbox.Card>
    )
}
