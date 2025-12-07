import {
    GetSubscriptionTemplatesCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'

import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'
import { getCoreLogoFromType } from '@shared/ui'
import { ROUTES } from '@shared/constants'

interface IProps {
    templates: GetSubscriptionTemplatesCommand.Response['response']['templates']
}

export const TemplatesSpotlightWidget = (props: IProps) => {
    const { templates } = props

    const navigate = useNavigate()

    const handleViewTemplate = (templateUuid: string, templateType: TSubscriptionTemplateType) => {
        navigate(
            generatePath(ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR, {
                type: templateType,
                uuid: templateUuid
            })
        )
    }

    return (
        <UniversalSpotlightContentShared
            actions={templates.map((template) => ({
                label: template.name,
                id: template.uuid,
                leftSection: getCoreLogoFromType({ type: template.templateType }),

                onClick: () => handleViewTemplate(template.uuid, template.templateType)
            }))}
        />
    )
}
