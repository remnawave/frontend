import { CreateUserCommand } from '@remnawave/backend-contract'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        createUser: (body: CreateUserCommand.Request) => Promise<boolean>
        changeModalState: (state: boolean) => void
        getInitialState: () => IState
        resetState: () => Promise<void>
    }
}
