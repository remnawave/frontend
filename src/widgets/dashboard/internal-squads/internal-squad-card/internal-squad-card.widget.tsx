import { TbCirclesRelation, TbServerCog, TbTag, TbUsersMinus, TbUsersPlus } from 'react-icons/tb'
import { PiCheck, PiCopy, PiPencil, PiTag, PiTrashDuotone, PiUsers } from 'react-icons/pi'
import { Badge, CopyButton, Group, Menu, Tooltip } from '@mantine/core'
import { GetInternalSquadsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'
import { formatInt } from '@shared/utils/misc'

interface IProps {
    handleAddToUsers: (internalSquadUuid: string, internalSquadName: string) => void
    handleDeleteInternalSquad: (internalSquadUuid: string, internalSquadName: string) => void
    handleRemoveFromUsers: (internalSquadUuid: string, internalSquadName: string) => void
    internalSquad: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    isDragOverlay?: boolean
}

export function InternalSquadCardWidget(props: IProps) {
    const {
        handleAddToUsers,
        handleDeleteInternalSquad,
        handleRemoveFromUsers,
        internalSquad,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()
    const openModalWithData = useModalsStoreOpenWithData()

    const { membersCount } = internalSquad.info
    const { inboundsCount } = internalSquad.info
    const isActive = membersCount > 0

    const handleOpenInbounds = () => {
        openModalWithData(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS, {
            squadUuid: internalSquad.uuid
        })
    }

    return (
        <WithDndSortable
            dragHandlePosition="top-right"
            id={internalSquad.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root withTopAccent={isActive}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={isActive} onClick={handleOpenInbounds}>
                        <TbCirclesRelation size={28} />
                    </EntityCardShared.Icon>
                    <EntityCardShared.Content title={internalSquad.name}>
                        <Group gap="xs" wrap="nowrap">
                            <Tooltip label={t('internal-squads-grid.widget.inbounds')}>
                                <Badge
                                    color="blue"
                                    leftSection={<PiTag size={12} />}
                                    size="lg"
                                    variant="light"
                                >
                                    {formatInt(inboundsCount, {
                                        thousandSeparator: ','
                                    })}
                                </Badge>
                            </Tooltip>

                            <Tooltip label={t('internal-squads-grid.widget.users')}>
                                <Badge
                                    color={isActive ? 'teal' : 'gray'}
                                    leftSection={<PiUsers size={12} />}
                                    size="lg"
                                    variant="light"
                                >
                                    {formatInt(membersCount, {
                                        thousandSeparator: ','
                                    })}
                                </Badge>
                            </Tooltip>
                        </Group>
                    </EntityCardShared.Content>
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Button
                        leftSection={<TbTag size={16} />}
                        onClick={handleOpenInbounds}
                    >
                        {t('common.edit')}
                    </EntityCardShared.Button>
                    <EntityCardShared.Menu>
                        <Menu.Item
                            color="teal"
                            leftSection={<TbUsersPlus size={18} />}
                            onClick={() => handleAddToUsers(internalSquad.uuid, internalSquad.name)}
                        >
                            {t('internal-squads-grid.widget.add-users')}
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            disabled={membersCount === 0}
                            leftSection={<TbUsersMinus size={18} />}
                            onClick={() =>
                                handleRemoveFromUsers(internalSquad.uuid, internalSquad.name)
                            }
                        >
                            {t('internal-squads-grid.widget.remove-users')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbServerCog size={18} />}
                            onClick={() =>
                                openModalWithData(MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER, {
                                    squadUuid: internalSquad.uuid
                                })
                            }
                        >
                            {t('internal-squad-card.widget.available-nodes')}
                        </Menu.Item>

                        <CopyButton timeout={2000} value={internalSquad.uuid}>
                            {({ copied, copy }) => (
                                <Menu.Item
                                    color={copied ? 'teal' : undefined}
                                    leftSection={
                                        copied ? <PiCheck size={18} /> : <PiCopy size={18} />
                                    }
                                    onClick={copy}
                                >
                                    {t('common.copy-uuid')}
                                </Menu.Item>
                            )}
                        </CopyButton>

                        <Menu.Item
                            leftSection={<PiPencil size={18} />}
                            onClick={() =>
                                openModalWithData(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL, {
                                    name: internalSquad.name,
                                    uuid: internalSquad.uuid
                                })
                            }
                        >
                            {t('common.rename')}
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            leftSection={<PiTrashDuotone size={18} />}
                            onClick={() =>
                                handleDeleteInternalSquad(internalSquad.uuid, internalSquad.name)
                            }
                        >
                            {t('internal-squads-grid.widget.delete-squad')}
                        </Menu.Item>
                    </EntityCardShared.Menu>
                </EntityCardShared.Actions>
            </EntityCardShared.Root>
        </WithDndSortable>
    )
}
