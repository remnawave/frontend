import { Badge, Card, Group, Text } from '@mantine/core'
import { TbCirclesRelation } from 'react-icons/tb'
import { PiTag, PiUsers } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { memo } from 'react'

import { InternalSquadsDrawer } from '@widgets/dashboard/users/internal-squads-drawer'
import { formatInt } from '@shared/utils/misc'

import classes from './Checkbox.module.css'
import { IProps } from './interfaces'

export const InternalSquadCardShared = memo((props: IProps) => {
    const { internalSquad } = props

    const [opened, handlers] = useDisclosure(false)

    if (!internalSquad) {
        return null
    }

    return (
        <>
            <Card
                className={classes.compactRoot}
                key={internalSquad.uuid}
                onClick={() => {
                    handlers.open()
                }}
            >
                <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                    <Group align="center" gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                        <TbCirclesRelation size={20} />
                        <Text className={classes.compactLabel} size="xs" truncate>
                            {internalSquad.name}
                        </Text>
                    </Group>

                    <Group gap="xs" wrap="nowrap">
                        <Badge
                            color="teal"
                            leftSection={<PiUsers size="16" />}
                            size="md"
                            variant="light"
                            visibleFrom="sm"
                        >
                            {formatInt(internalSquad.info.membersCount, {
                                thousandSeparator: ','
                            })}{' '}
                        </Badge>
                        <Badge
                            color="blue"
                            leftSection={<PiTag size="16" />}
                            size="md"
                            variant="light"
                        >
                            {internalSquad.info.inboundsCount}
                        </Badge>
                    </Group>
                </Group>
            </Card>

            <InternalSquadsDrawer
                internalSquad={internalSquad}
                onClose={handlers.close}
                opened={opened}
            />
        </>
    )
})
