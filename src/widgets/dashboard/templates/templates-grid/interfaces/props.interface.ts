import {
    GetSubscriptionTemplatesCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'

export interface IProps {
    templates: GetSubscriptionTemplatesCommand.Response['response']['templates']
    templateTitle: string
    type: TSubscriptionTemplateType
}
