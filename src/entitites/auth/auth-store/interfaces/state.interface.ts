import { LoginCommand } from '@remnawave/backend-contract'

export interface IState {
    isLoading: boolean
    loginResponse: LoginCommand.Response['response'] | null
}
