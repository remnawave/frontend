import { TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { Divider } from '@mantine/core'

import { SubscriptionTemplateEditorWidget } from '@widgets/dashboard/templates/subscription-template-editor'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

interface Props {
    encodedTemplateYaml: null | string | undefined
    language: 'json' | 'yaml'
    templateJson: null | string | undefined
    templateType: TSubscriptionTemplateType
    title?: string
}

export const TemplateBasePageComponent = (props: Props) => {
    const { t } = useTranslation()
    const {
        encodedTemplateYaml,
        templateType,
        templateJson,
        language,
        title = t('constants.config')
    } = props

    return (
        <Page title={title}>
            <PageHeader
                breadcrumbs={[{ label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME }]}
                title={title}
            />
            <SubscriptionTemplateEditorWidget
                encodedTemplateYaml={encodedTemplateYaml}
                language={language}
                templateJson={templateJson}
                templateType={templateType}
            />
            <Divider mb="md" mt="md" size="md" />
        </Page>
    )
}
