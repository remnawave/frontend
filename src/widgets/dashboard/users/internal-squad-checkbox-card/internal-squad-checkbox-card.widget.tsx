import { ActionIcon, Badge, Checkbox, Group, Text } from '@mantine/core'
import { PiTag, PiUsers } from 'react-icons/pi'
import { TbEdit } from 'react-icons/tb'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { formatInt } from '@shared/utils/misc'

import classes from './Checkbox.module.css'
import { IProps } from './interfaces'

export const InternalSquadCheckboxCard = memo((props: IProps) => {
    const { internalSquad, hideEditButton } = props

    const openModalWithData = useModalsStoreOpenWithData()

    const handleOpenEditModal = (squadUuid: string) => {
        openModalWithData(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS, {
            squadUuid
        })
    }

    if (!internalSquad) {
        return null
    }

    return (
        <Checkbox.Card
            className={classes.compactRoot}
            key={internalSquad.uuid}
            radius="md"
            value={internalSquad.uuid}
        >
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                    <Checkbox.Indicator size="sm" />
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
                    <Badge color="blue" leftSection={<PiTag size="16" />} size="md" variant="light">
                        {internalSquad.info.inboundsCount}
                    </Badge>
                    {!hideEditButton && (
                        <ActionIcon
                            color="cyan"
                            component="a"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.nativeEvent.stopImmediatePropagation()

                                handleOpenEditModal(internalSquad.uuid)
                            }}
                            size="lg"
                            variant="default"
                        >
                            <TbEdit size={16} />
                        </ActionIcon>
                    )}
                </Group>
            </Group>
        </Checkbox.Card>
    )
})
