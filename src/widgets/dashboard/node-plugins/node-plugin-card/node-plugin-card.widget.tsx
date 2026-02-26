import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { GetNodePluginsCommand } from '@remnawave/backend-contract'
import { TbCopyCheck, TbEdit, TbPlug } from 'react-icons/tb'
import { generatePath, useNavigate } from 'react-router-dom'
import { CopyButton, Menu } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'
import { ROUTES } from '@shared/constants'

interface IProps {
    handleCloneNodePlugin: (nodePluginUuid: string) => void
    handleDeleteNodePlugin: (nodePluginUuid: string) => void
    isDragOverlay?: boolean
    nodePlugin: GetNodePluginsCommand.Response['response']['nodePlugins'][number]
}

export function NodePluginCardWidget(props: IProps) {
    const {
        nodePlugin,
        handleDeleteNodePlugin,
        handleCloneNodePlugin,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()
    const openModalWithData = useModalsStoreOpenWithData()
    const navigate = useNavigate()

    const navigateToNodePlugin = () => {
        navigate(
            generatePath(ROUTES.DASHBOARD.MANAGEMENT.NODE_PLUGINS.NODE_PLUGIN_BY_UUID, {
                uuid: nodePlugin.uuid
            })
        )
    }

    return (
        <WithDndSortable
            dragHandlePosition="top-right"
            id={nodePlugin.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={false} onClick={navigateToNodePlugin}>
                        <TbPlug size={24} />
                    </EntityCardShared.Icon>

                    <EntityCardShared.Content subtitle="PLUGIN" title={nodePlugin.name} />
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Button
                        leftSection={<TbEdit size={16} />}
                        onClick={navigateToNodePlugin}
                    >
                        {t('common.edit')}
                    </EntityCardShared.Button>

                    <EntityCardShared.Menu>
                        <CopyButton timeout={2000} value={nodePlugin.uuid}>
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
                            onClick={() => {
                                openModalWithData(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL, {
                                    name: nodePlugin.name,
                                    uuid: nodePlugin.uuid
                                })
                            }}
                        >
                            {t('common.rename')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbCopyCheck size={18} />}
                            onClick={() => handleCloneNodePlugin(nodePlugin.uuid)}
                        >
                            {t('common.clone')}
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            leftSection={<PiTrashDuotone size={18} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteNodePlugin(nodePlugin.uuid)
                            }}
                        >
                            {t('common.delete')}
                        </Menu.Item>
                    </EntityCardShared.Menu>
                </EntityCardShared.Actions>
            </EntityCardShared.Root>
        </WithDndSortable>
    )
}
