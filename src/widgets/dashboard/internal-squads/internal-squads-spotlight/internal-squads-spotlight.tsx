import { GetInternalSquadsCommand } from '@remnawave/backend-contract'
import { TbCirclesRelation } from 'react-icons/tb'
import { PiTag, PiUsers } from 'react-icons/pi'
import { Badge, Group } from '@mantine/core'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'
import { formatInt } from '@shared/utils/misc'

interface IProps {
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
}

export const InternalSquadsSpotlightWidget = (props: IProps) => {
    const { internalSquads } = props

    const openModalWithData = useModalsStoreOpenWithData()

    const handleOpenEditModal = (
        internalSquad: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    ) => {
        openModalWithData(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS, internalSquad)
    }

    return (
        <UniversalSpotlightContentShared
            actions={internalSquads.map((item) => ({
                label: item.name,
                id: item.uuid,
                leftSection: <TbCirclesRelation color="var(--mantine-color-gray-5)" size={16} />,
                rightSection: (
                    <Group gap="xs" wrap="nowrap">
                        <Badge
                            color="blue"
                            leftSection={<PiTag size={12} />}
                            size="lg"
                            variant="light"
                        >
                            {formatInt(item.info.inboundsCount, {
                                thousandSeparator: ','
                            })}
                        </Badge>

                        <Badge
                            color={item.info.membersCount > 0 ? 'teal' : 'gray'}
                            leftSection={<PiUsers size={12} />}
                            size="lg"
                            variant="light"
                        >
                            {formatInt(item.info.membersCount, {
                                thousandSeparator: ','
                            })}
                        </Badge>
                    </Group>
                ),
                onClick: () => handleOpenEditModal(item)
            }))}
        />
    )
}
