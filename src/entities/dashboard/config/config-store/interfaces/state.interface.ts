import { GetXrayConfigCommand } from '@remnawave/backend-contract'

export interface IState {
    config: GetXrayConfigCommand.Response['response']['config'] | null | string
    isConfigLoading: boolean
}
