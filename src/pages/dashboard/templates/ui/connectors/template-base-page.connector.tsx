import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import { useGetSubscriptionTemplate } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { TemplateBasePageComponent } from '../components/template-base-page.component'

interface Props {
    language: 'json' | 'yaml'
    templateType: TSubscriptionTemplateType
    title?: string
}

export function TemplateBasePageConnector(props: Props) {
    const { templateType, language, title } = props

    const {
        data: { encodedTemplateYaml, templateJson } = {
            encodedTemplateYaml: undefined,
            templateJson: undefined
        },
        isLoading: isConfigLoading
    } = useGetSubscriptionTemplate({
        route: {
            templateType
        }
    })

    if (isConfigLoading) {
        return <LoadingScreen text={`Loading template...`} />
    }

    return (
        <TemplateBasePageComponent
            encodedTemplateYaml={encodedTemplateYaml}
            language={language}
            templateJson={templateJson as string | undefined}
            templateType={templateType}
            title={title}
        />
    )
}
