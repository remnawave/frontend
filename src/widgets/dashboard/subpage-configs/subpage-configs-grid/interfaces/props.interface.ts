import { GetSubscriptionPageConfigsCommand } from '@remnawave/backend-contract'

export interface IProps {
    configs: GetSubscriptionPageConfigsCommand.Response['response']['configs']
}
