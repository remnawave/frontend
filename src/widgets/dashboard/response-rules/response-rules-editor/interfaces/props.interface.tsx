import { GetSubscriptionSettingsCommand } from '@remnawave/backend-contract'

export interface IProps {
    responseRules: GetSubscriptionSettingsCommand.Response['response']['responseRules']
    subscriptionSettingsUuid: string
}
