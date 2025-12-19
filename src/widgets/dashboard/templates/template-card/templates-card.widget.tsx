import { GetSubscriptionTemplatesCommand } from '@remnawave/backend-contract'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { generatePath, useNavigate } from 'react-router-dom'
import { CopyButton, Menu } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbEdit } from 'react-icons/tb'
import { ReactNode } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'
import { ROUTES } from '@shared/constants'

interface IProps {
    handleDeleteTemplate: (templateUuid: string) => void
    isDragOverlay?: boolean
    template: GetSubscriptionTemplatesCommand.Response['response']['templates'][number]
    templateTitle: string
    themeLogo: ReactNode
}

export function TemplatesCardWidget(props: IProps) {
    const {
        template,
        templateTitle,
        themeLogo,
        handleDeleteTemplate,
        isDragOverlay = false
    } = props

    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    const navigate = useNavigate()

    return (
        <WithDndSortable
            dragHandlePosition="top-right"
            id={template.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root withTopAccent={template.name === 'Default'}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon
                        highlight={template.name === 'Default'}
                        onClick={() =>
                            navigate(
                                generatePath(ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR, {
                                    type: template.templateType,
                                    uuid: template.uuid
                                })
                            )
                        }
                    >
                        {themeLogo}
                    </EntityCardShared.Icon>
                    <EntityCardShared.Content subtitle={templateTitle} title={template.name} />
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Button
                        leftSection={<TbEdit size={16} />}
                        onClick={() =>
                            navigate(
                                generatePath(ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR, {
                                    type: template.templateType,
                                    uuid: template.uuid
                                })
                            )
                        }
                    >
                        {t('common.edit')}
                    </EntityCardShared.Button>
                    <EntityCardShared.Menu>
                        <CopyButton timeout={2000} value={template.uuid}>
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
                            disabled={template.name === 'Default'}
                            leftSection={<PiPencil size={18} />}
                            onClick={() => {
                                openModalWithData(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL, {
                                    name: template.name,
                                    uuid: template.uuid
                                })
                            }}
                        >
                            {t('common.rename')}
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            disabled={template.name === 'Default'}
                            leftSection={<PiTrashDuotone size={18} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTemplate(template.uuid)
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
