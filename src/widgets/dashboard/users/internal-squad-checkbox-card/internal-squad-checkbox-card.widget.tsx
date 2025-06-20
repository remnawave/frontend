import { ActionIcon, Badge, Checkbox, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PiUsers } from 'react-icons/pi'
import { TbEdit } from 'react-icons/tb'
import { memo } from 'react'

import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import { InternalSquadsDrawer } from '../internal-squads-drawer'
import classes from './Checkbox.module.css'
import { IProps } from './interfaces'

export const InternalSquadCheckboxCard = memo((props: IProps) => {
    const { internalSquad } = props

    const [opened, handlers] = useDisclosure(false)

    if (!internalSquad) {
        return null
    }

    const handleShowInbounds = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()

        handlers.open()
    }

    return (
        <>
            <Checkbox.Card
                className={classes.compactRoot}
                key={internalSquad.uuid}
                radius="md"
                value={internalSquad.uuid}
            >
                <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                    <Group align="center" gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                        <Checkbox.Indicator size="sm" />
                        <Text className={classes.compactLabel} size="sm" truncate>
                            {internalSquad.name}
                        </Text>
                    </Group>

                    <Group gap="xs" wrap="nowrap">
                        <Badge
                            color="teal"
                            leftSection={<PiUsers size="16" />}
                            size="md"
                            variant="outline"
                        >
                            {internalSquad.info.membersCount}
                        </Badge>
                        <Badge
                            color="gray"
                            leftSection={<XtlsLogo size="16" />}
                            onClick={(e) => handleShowInbounds(e)}
                            size="md"
                            style={{ cursor: 'pointer' }}
                            variant="outline"
                        >
                            {internalSquad.info.inboundsCount}
                        </Badge>
                        <ActionIcon
                            color="cyan"
                            component="a"
                            onClick={(e) => handleShowInbounds(e)}
                            radius={'md'}
                            size="lg"
                            variant="default"
                        >
                            <TbEdit size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Checkbox.Card>

            <InternalSquadsDrawer
                internalSquad={internalSquad}
                onClose={handlers.close}
                opened={opened}
            />
        </>
    )
})
