import { CopyButton, Menu } from '@mantine/core'
import { GetSubpageConfigsCommand } from '@remnawave/backend-contract'
import { SUBPAGE_DEFAULT_CONFIG_UUID } from '@remnawave/subscription-page-types'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { TbCopyCheck, TbEdit, TbFile } from 'react-icons/tb'
import { generatePath, useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { ROUTES } from '@shared/constants'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'

interface IProps {
    handleCloneSubpageConfig: (subpageConfigUuid: string) => void
    handleDeleteSubpageConfig: (subpageConfigUuid: string) => void
    isDragOverlay?: boolean
    subpageConfig: GetSubpageConfigsCommand.Response['response']['configs'][number]
}

export function SubpageConfigCardWidget(props: IProps) {
    const {
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
            dragHandlePosition="top-right"
            id={subpageConfig.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root withTopAccent={isDefault}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={isDefault} onClick={navigateToConfig}>
                        <TbFile size={24} />
                    </EntityCardShared.Icon>

                    <EntityCardShared.Content
                        subtitle="Subpage Config"
                        title={subpageConfig.name}
                    />
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Button
                        leftSection={<TbEdit size={16} />}
                        onClick={navigateToConfig}
                    >
                        {t('common.action.edit')}
                    </EntityCardShared.Button>

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
