import { ActionIcon, ColorSwatch, Menu, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { TbBookmark, TbPlus, TbTrash } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import {
    useUsersTableTemplates,
    useUsersTableTemplatesActions
} from '@entities/dashboard/users/users-table-templates-store'

import { IProps } from './interfaces'
import { getSwatchColor } from './lib/constants'
import { applySnapshot, captureSnapshot } from './lib/snapshot'
import { SaveTemplateModal } from './ui/save-template.modal'

export const UsersTableTemplatesFeature = (props: IProps) => {
    const { table } = props
    const { t } = useTranslation()

    const templates = useUsersTableTemplates()
    const { removeTemplate } = useUsersTableTemplatesActions()

    return (
        <Menu position="bottom-end" shadow="md" width={260} withArrow>
            <Menu.Target>
                <Tooltip label={t('constants.templates')} withArrow>
                    <ActionIcon color="indigo" size="input-md" variant="soft">
                        <TbBookmark size="24px" />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
                {templates.length > 0 &&
                    templates.map((template) => (
                        <Menu.Item
                            key={template.id}
                            leftSection={
                                <ColorSwatch color={getSwatchColor(template.color)} size={14} />
                            }
                            onClick={() => applySnapshot(table, template.snapshot)}
                            rightSection={
                                <ActionIcon
                                    aria-label={t('common.action.delete')}
                                    color="red"
                                    component="div"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        removeTemplate(template.id)
                                    }}
                                    size="sm"
                                    variant="subtle"
                                >
                                    <TbTrash size={14} />
                                </ActionIcon>
                            }
                        >
                            {template.name}
                        </Menu.Item>
                    ))}

                {templates.length > 0 && <Menu.Divider />}

                <Menu.Item
                    leftSection={<TbPlus size={14} />}
                    onClick={() => {
                        modals.open({
                            title: (
                                <BaseOverlayHeader
                                    iconColor="cyan"
                                    IconComponent={TbBookmark}
                                    iconVariant="soft"
                                    title={t('constants.templates')}
                                />
                            ),
                            centered: true,
                            size: 'md',
                            children: (
                                <SaveTemplateModal getSnapshot={() => captureSnapshot(table)} />
                            )
                        })
                    }}
                >
                    {t('common.action.save')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
