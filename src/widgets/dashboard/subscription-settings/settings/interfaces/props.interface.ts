import { GetSubscriptionSettingsCommand } from '@remnawave/backend-contract'

export interface IProps {
    subscriptionSettings: GetSubscriptionSettingsCommand.Response['response']
}
