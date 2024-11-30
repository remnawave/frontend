import { GetXrayConfigCommand } from '@remnawave/backend-contract'

export interface IState {
    isConfigLoading: boolean
    config: GetXrayConfigCommand.Response['response']['config'] | string | null
}
