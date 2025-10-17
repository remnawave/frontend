import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

import {
    IDownloadableSubscriptionTemplate,
    IDownloadableSubscriptionTemplateList
} from '@shared/constants/templates'

export interface TemplateSelectorProps {
    editorType: 'SRR' | 'SUBSCRIPTION' | 'XRAY_CORE'
    onSelect: (template: IDownloadableSubscriptionTemplate) => void
    selectedTemplate?: IDownloadableSubscriptionTemplate
    templates: IDownloadableSubscriptionTemplateList['templates']
    templateType: 'SRR' | TSubscriptionTemplateType
}
