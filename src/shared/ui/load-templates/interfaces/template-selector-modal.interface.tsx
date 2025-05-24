import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import { DownloadableSubscriptionTemplate } from '@shared/constants/templates/template-list'

export interface TemplateSelectorModalProps {
    onCancel: () => void
    onLoadTemplate: (template: DownloadableSubscriptionTemplate) => Promise<void>
    templates: DownloadableSubscriptionTemplate[]
    templateType: TSubscriptionTemplateType
}
