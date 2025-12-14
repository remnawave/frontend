import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import { IDownloadableSubscriptionTemplate } from '@shared/constants/templates'

export interface TemplateSelectorModalProps {
    editorType: 'SRR' | 'SUBPAGE_CONFIG' | 'SUBSCRIPTION' | 'XRAY_CORE'
    onCancel: () => void
    onLoadTemplate: (template: IDownloadableSubscriptionTemplate) => Promise<void>
    templateType: 'SRR' | 'SUBPAGE_CONFIG' | TSubscriptionTemplateType
}
