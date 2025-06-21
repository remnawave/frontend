import { GetInfraProvidersCommand } from '@remnawave/backend-contract'

export interface IProps {
    infraProviders: GetInfraProvidersCommand.Response['response']['providers']
    infraProvidersLoading: boolean
}
