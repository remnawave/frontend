import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import { IDownloadableSubscriptionTemplate } from '@shared/constants/templates'

export interface TemplateSelectorModalProps {
    editorType: 'NODE_PLUGIN' | 'SRR' | 'SUBPAGE_CONFIG' | 'SUBSCRIPTION' | 'XRAY_CORE'
    onCancel: () => void
    onLoadTemplate: (template: IDownloadableSubscriptionTemplate) => Promise<void>
    templateType: 'NODE_PLUGIN' | 'SRR' | 'SUBPAGE_CONFIG' | TSubscriptionTemplateType
}
