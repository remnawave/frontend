import {
    GetSubscriptionSettingsCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'

export interface IProps {
    externalSquads: { name: string; uuid: string }[]
    groupedTemplates: Record<TSubscriptionTemplateType, string[]>
    responseRules: GetSubscriptionSettingsCommand.Response['response']['responseRules']
    subscriptionSettingsUuid: string
}
