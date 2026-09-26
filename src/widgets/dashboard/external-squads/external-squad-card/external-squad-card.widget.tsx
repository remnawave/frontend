import { Badge, CopyButton, Group, Menu, Tooltip } from '@mantine/core'
import { GetExternalSquadsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone, PiUsers } from 'react-icons/pi'
import { TbCopy, TbTags, TbUsersMinus, TbUsersPlus, TbWebhook } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'
import { formatInt } from '@shared/utils/misc'

interface IProps {
    disableReordering?: boolean
    externalSquad: GetExternalSquadsCommand.Response['response']['externalSquads'][number]
    handleAddToUsers: (externalSquadUuid: string) => void
    handleCloneExternalSquad: (externalSquadUuid: string) => void
    handleDeleteExternalSquad: (externalSquadUuid: string) => void
    handleRemoveFromUsers: (externalSquadUuid: string) => void
    isDragOverlay?: boolean
}

export function ExternalSquadCardWidget(props: IProps) {
    const {
        disableReordering = false,
        handleAddToUsers,
        handleDeleteExternalSquad,
        handleRemoveFromUsers,
        handleCloneExternalSquad,
        externalSquad,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()

    const handleRename = () => {
        showModal('renameModal', {
            renameFrom: 'externalSquad',
            name: externalSquad.name,
            uuid: externalSquad.uuid
        })
    }

    const { membersCount } = externalSquad.info
    const isActive = membersCount > 0

    const openExternalSquad = () =>
        showModal('externalSquads_externalSquadsDrawer', { uuid: externalSquad.uuid })

    return (
        <WithDndSortable
            disableReordering={disableReordering}
            dragHandlePosition="inline-end"
            id={externalSquad.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root isActive={isActive} onClick={openExternalSquad}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={isActive}>
                        <TbWebhook size={22} />
                    </EntityCardShared.Icon>
                    <EntityCardShared.Content
                        tags={externalSquad.tags}
                        badges={
                            <Group gap="xs" wrap="nowrap">
                                <Tooltip label={t('external-squad-card.widget.users')}>
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
                        title={externalSquad.name}
                    />
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Menu>
                        <Menu.Item
                            color="teal"
                            leftSection={<TbUsersPlus size={18} />}
                            onClick={() => handleAddToUsers(externalSquad.uuid)}
                        >
                            {t('common.action.add-users')}
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            disabled={membersCount === 0}
                            leftSection={<TbUsersMinus size={18} />}
                            onClick={() => handleRemoveFromUsers(externalSquad.uuid)}
                        >
                            {t('common.action.remove-users')}
                        </Menu.Item>

                        <CopyButton timeout={2000} value={externalSquad.uuid}>
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

                        <Menu.Item leftSection={<PiPencil size={18} />} onClick={handleRename}>
                            {t('common.action.rename')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbTags size={18} />}

                            onClick={() => {
                                showModal('editTagsModal', {
                                    editTagsFrom: 'externalSquad',

                                    tags: externalSquad.tags,

                                    uuid: externalSquad.uuid
                                })
                            }}
                        >
                            {t('common.field.tags')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbCopy size={18} />}
                            onClick={() => handleCloneExternalSquad(externalSquad.uuid)}
                        >
                            {t('common.action.clone')}
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            leftSection={<PiTrashDuotone size={18} />}
                            onClick={() => handleDeleteExternalSquad(externalSquad.uuid)}
                        >
                            {t('common.action.delete')}
                        </Menu.Item>
                    </EntityCardShared.Menu>
                </EntityCardShared.Actions>
            </EntityCardShared.Root>
        </WithDndSortable>
    )
}
