import { GetExternalSquadsCommand } from '@remnawave/backend-contract'
import { Badge, Group } from '@mantine/core'
import { TbWebhook } from 'react-icons/tb'
import { PiUsers } from 'react-icons/pi'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'
import { formatInt } from '@shared/utils/misc'

interface IProps {
    externalSquads: GetExternalSquadsCommand.Response['response']['externalSquads']
}

export const ExternalSquadsSpotlightWidget = (props: IProps) => {
    const { externalSquads } = props

    const openModalWithData = useModalsStoreOpenWithData()

    const handleOpenEditModal = (uuid: string) => {
        openModalWithData(MODALS.EXTERNAL_SQUAD_DRAWER, uuid)
    }

    return (
        <UniversalSpotlightContentShared
            actions={externalSquads.map((externalSquad) => ({
                label: externalSquad.name,
                id: externalSquad.uuid,
                leftSection: <TbWebhook color="var(--mantine-color-gray-5)" size={16} />,
                rightSection: (
                    <Group gap="xs" wrap="nowrap">
                        <Badge
                            color={externalSquad.info.membersCount > 0 ? 'teal' : 'gray'}
                            leftSection={<PiUsers size={12} />}
                            size="lg"
                            variant="light"
                        >
                            {formatInt(externalSquad.info.membersCount, {
                                thousandSeparator: ','
                            })}
                        </Badge>
                    </Group>
                ),
                onClick: () => handleOpenEditModal(externalSquad.uuid)
            }))}
        />
    )
}
