import { UpdateUserCommand } from '@remnawave/backend-contract'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        getUser: () => Promise<boolean>
        updateUser: (body: UpdateUserCommand.Request) => Promise<boolean>
        disableUser: () => Promise<boolean>
        enableUser: () => Promise<boolean>
        deleteUser: () => Promise<boolean>
        reveokeSubscription: () => Promise<boolean>
        changeModalState: (state: boolean) => void
        setUserUuid: (userUuid: string) => Promise<void>
        resetState: () => Promise<void>
        getInitialState: () => IState
    }
}
