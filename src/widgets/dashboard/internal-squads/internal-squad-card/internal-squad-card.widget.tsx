import { Badge, CopyButton, Group, Menu, Tooltip } from '@mantine/core'
import { GetInternalSquadsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiPencil, PiTag, PiTrashDuotone, PiUsers } from 'react-icons/pi'
import {
    TbChartArcs,
    TbCirclesRelation,
    TbServerCog,
    TbTags,
    TbUsersMinus,
    TbUsersPlus
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'
import { formatInt } from '@shared/utils/misc'

interface IProps {
    disableReordering?: boolean
    handleAddToUsers: (internalSquadUuid: string, internalSquadName: string) => void
    handleDeleteInternalSquad: (internalSquadUuid: string, internalSquadName: string) => void
    handleRemoveFromUsers: (internalSquadUuid: string, internalSquadName: string) => void
    internalSquad: GetInternalSquadsCommand.Response['response']['internalSquads'][number]
    isDragOverlay?: boolean
}

export function InternalSquadCardWidget(props: IProps) {
    const {
        disableReordering = false,
        handleAddToUsers,
        handleDeleteInternalSquad,
        handleRemoveFromUsers,
        internalSquad,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()

    const { membersCount } = internalSquad.info
    const { inboundsCount } = internalSquad.info
    const isActive = membersCount > 0

    const handleOpenInbounds = () => {
        showModal('internalSquads_internalSquadsInboundsDrawer', {
            squadUuid: internalSquad.uuid
        })
    }

    return (
        <WithDndSortable
            disableReordering={disableReordering}
            dragHandlePosition="inline-end"
            id={internalSquad.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root isActive={isActive} onClick={handleOpenInbounds}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={isActive}>
                        <TbCirclesRelation size={22} />
                    </EntityCardShared.Icon>
                    <EntityCardShared.Content
                        tags={internalSquad.tags}
                        badges={
                            <Group gap="xs" wrap="nowrap">
                                <Tooltip label={t('common.field.inbounds')}>
                                    <Badge
                                        color="blue"
                                        leftSection={<PiTag size={12} />}
                                        size="lg"
                                        variant="soft"
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
                                        variant="soft"
                                    >
                                        {formatInt(membersCount, {
                                            thousandSeparator: ','
                                        })}
                                    </Badge>
                                </Tooltip>
                            </Group>
                        }
                        title={internalSquad.name}
                    />
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Menu>
                        <Menu.Item
                            color="teal"
                            leftSection={<TbUsersPlus size={18} />}
                            onClick={() => handleAddToUsers(internalSquad.uuid, internalSquad.name)}
                        >
                            {t('common.action.add-users')}
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            disabled={membersCount === 0}
                            leftSection={<TbUsersMinus size={18} />}
                            onClick={() =>
                                handleRemoveFromUsers(internalSquad.uuid, internalSquad.name)
                            }
                        >
                            {t('common.action.remove-users')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbServerCog size={18} />}
                            onClick={() =>
                                showModal('internalSquads_internalSquadAccessibleNodesDrawer', {
                                    uuid: internalSquad.uuid
                                })
                            }
                        >
                            {t('internal-squad-card.widget.available-nodes')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbChartArcs size={18} />}
                            onClick={() =>
                                showModal('internalSquads_internalSquadsUsageDrawer', {
                                    squadUuid: internalSquad.uuid
                                })
                            }
                        >
                            {t('common.field.usage-stats')}
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
                                    {t('common.action.copy-uuid')}
                                </Menu.Item>
                            )}
                        </CopyButton>

                        <Menu.Item
                            leftSection={<PiPencil size={18} />}
                            onClick={() =>
                                showModal('renameModal', {
                                    renameFrom: 'internalSquad',
                                    name: internalSquad.name,
                                    uuid: internalSquad.uuid
                                })
                            }
                        >
                            {t('common.action.rename')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbTags size={18} />}

                            onClick={() => {
                                showModal('editTagsModal', {
                                    editTagsFrom: 'internalSquad',

                                    tags: internalSquad.tags,

                                    uuid: internalSquad.uuid
                                })
                            }}
                        >
                            {t('common.field.tags')}
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
