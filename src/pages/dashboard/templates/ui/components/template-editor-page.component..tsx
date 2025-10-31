import { GetSubscriptionTemplateCommand } from '@remnawave/backend-contract'
import { ActionIcon, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { TbArrowBack } from 'react-icons/tb'

import { SubscriptionTemplateEditorWidget } from '@widgets/dashboard/templates/subscription-template-editor'
import { getCoreLogoFromType } from '@shared/ui/get-core-logo-from-type'
import { HelpActionIconShared } from '@shared/ui/help-drawer'
import { Page, PageHeaderShared } from '@shared/ui'
import { ROUTES } from '@shared/constants'

interface Props {
    editorType: 'json' | 'yaml'
    template: GetSubscriptionTemplateCommand.Response['response']
    title: string
}

export const TemplateEditorPageComponent = (props: Props) => {
    const { editorType, template, title } = props
    const navigate = useNavigate()

    let isHelpDrawerVisible = false

    if (template.templateType === 'XRAY_JSON') {
        isHelpDrawerVisible = true
    }

    return (
        <Page title={title}>
            <PageHeaderShared
                actions={
                    <Group>
                        <HelpActionIconShared
                            hidden={!isHelpDrawerVisible}
                            screen="EDITOR_TEMPLATES_XRAY_JSON"
                        />

                        <ActionIcon
                            color="gray"
                            onClick={() =>
                                navigate(
                                    ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                                        ':type',
                                        template.templateType
                                    )
                                )
                            }
                            size="input-md"
                            variant="light"
                        >
                            <TbArrowBack size={24} />
                        </ActionIcon>
                    </Group>
                }
                icon={getCoreLogoFromType({ type: template.templateType })}
                title={template.name}
            />
            <SubscriptionTemplateEditorWidget editorType={editorType} template={template} />
        </Page>
    )
}
