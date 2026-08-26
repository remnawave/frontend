import { CopyButton, Menu } from '@mantine/core'
import { GetSubscriptionTemplatesCommand } from '@remnawave/backend-contract'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import { TbEdit } from 'react-icons/tb'
import { generatePath, useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { ROUTES } from '@shared/constants'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'

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
                        {t('common.action.edit')}
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
                                    {t('common.action.copy-uuid')}
                                </Menu.Item>
                            )}
                        </CopyButton>

                        <Menu.Item
                            disabled={template.name === 'Default'}
                            leftSection={<PiPencil size={18} />}
                            onClick={() => {
                                showModal('renameModal', {
                                    renameFrom: 'template',
                                    name: template.name,
                                    uuid: template.uuid
                                })
                            }}
                        >
                            {t('common.action.rename')}
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
                            {t('common.action.delete')}
                        </Menu.Item>
                    </EntityCardShared.Menu>
                </EntityCardShared.Actions>
            </EntityCardShared.Root>
        </WithDndSortable>
    )
}
