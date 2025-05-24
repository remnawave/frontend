import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import { DownloadableSubscriptionTemplate } from '@shared/constants/templates/template-list'

export interface TemplateSelectorProps {
    onSelect: (template: DownloadableSubscriptionTemplate) => void
    selectedTemplate?: DownloadableSubscriptionTemplate
    templates: DownloadableSubscriptionTemplate[]
    templateType: TSubscriptionTemplateType
}
