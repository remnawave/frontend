import { CreateUserCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        changeModalState: (state: boolean) => void
        createUser: (body: CreateUserCommand.Request) => Promise<boolean>
        getInitialState: () => IState
        resetState: () => Promise<void>
    }
}
