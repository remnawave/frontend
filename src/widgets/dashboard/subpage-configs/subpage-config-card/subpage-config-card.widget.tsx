import { CopyButton, Menu } from '@mantine/core'
import { GetSubpageConfigsCommand } from '@remnawave/backend-contract'
import { SUBPAGE_DEFAULT_CONFIG_UUID } from '@remnawave/subscription-page-types'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { TbCopyCheck, TbFile, TbTags } from 'react-icons/tb'
import { generatePath, useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { ROUTES } from '@shared/constants'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'

interface IProps {
    disableReordering?: boolean
    handleCloneSubpageConfig: (subpageConfigUuid: string) => void
    handleDeleteSubpageConfig: (subpageConfigUuid: string) => void
    isDragOverlay?: boolean
    subpageConfig: GetSubpageConfigsCommand.Response['response']['configs'][number]
}

export function SubpageConfigCardWidget(props: IProps) {
    const {
        disableReordering = false,
        subpageConfig,
        handleDeleteSubpageConfig,
        handleCloneSubpageConfig,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()
    const navigate = useNavigate()

    const navigateToConfig = () => {
        navigate(
            generatePath(ROUTES.DASHBOARD.SUBPAGE_CONFIGS.SUBPAGE_CONFIG_BY_UUID, {
                uuid: subpageConfig.uuid
            })
        )
    }

    const isDefault = subpageConfig.uuid === SUBPAGE_DEFAULT_CONFIG_UUID

    return (
        <WithDndSortable
            disableReordering={disableReordering}
            dragHandlePosition="inline-end"
            id={subpageConfig.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root isActive={isDefault} onClick={navigateToConfig}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={isDefault}>
                        <TbFile size={22} />
                    </EntityCardShared.Icon>

                    <EntityCardShared.Content
                        tags={subpageConfig.tags}
                        title={subpageConfig.name}
                    />
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Menu>
                        <CopyButton timeout={2000} value={subpageConfig.uuid}>
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
                            onClick={() => {
                                showModal('renameModal', {
                                    renameFrom: 'subpageConfig',
                                    name: subpageConfig.name,
                                    uuid: subpageConfig.uuid
                                })
                            }}
                        >
                            {t('common.action.rename')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbTags size={18} />}

                            onClick={() => {
                                showModal('editTagsModal', {
                                    editTagsFrom: 'subpageConfig',

                                    tags: subpageConfig.tags,

                                    uuid: subpageConfig.uuid
                                })
                            }}
                        >
                            {t('common.field.tags')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbCopyCheck size={18} />}
                            onClick={() => handleCloneSubpageConfig(subpageConfig.uuid)}
                        >
                            {t('common.action.clone')}
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            disabled={isDefault}
                            leftSection={<PiTrashDuotone size={18} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSubpageConfig(subpageConfig.uuid)
                            }}
                        >
                            {t('common.action.delete')}
                        </Menu.Item>
                    </EntityCardShared.Menu>
                </EntityCardShared.Actions>
            </EntityCardShared.Root>
        </WithDndSortable>
    )
}
