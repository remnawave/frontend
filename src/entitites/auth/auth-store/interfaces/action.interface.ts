import { LoginCommand } from '@remnawave/backend-contract'

export interface IActions {
    actions: {
        login: (data: LoginCommand.Request) => Promise<void>
        resetState: () => Promise<void>
    }
}
