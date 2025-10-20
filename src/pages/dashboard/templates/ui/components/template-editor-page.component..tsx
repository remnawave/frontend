import { GetSubscriptionTemplateCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'

import { SubscriptionTemplateEditorWidget } from '@widgets/dashboard/templates/subscription-template-editor'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

interface Props {
    editorType: 'json' | 'yaml'
    template: GetSubscriptionTemplateCommand.Response['response']
    title: string
}

export const TemplateEditorPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { editorType, template, title } = props

    return (
        <Page title={title}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.templates') },
                    {
                        label: title,
                        href: ROUTES.DASHBOARD.TEMPLATES.TEMPLATES_BY_TYPE.replace(
                            ':type',
                            template.templateType
                        )
                    },
                    { label: template.name }
                ]}
                title={template.name}
            />
            <SubscriptionTemplateEditorWidget editorType={editorType} template={template} />
        </Page>
    )
}
