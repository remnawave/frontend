import { UpdateUserCommand } from '@remnawave/backend-contract'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        changeModalState: (state: boolean) => void
        deleteUser: () => Promise<boolean>
        disableUser: () => Promise<boolean>
        enableUser: () => Promise<boolean>
        getInitialState: () => IState
        getUser: () => Promise<boolean>
        resetState: () => Promise<void>
        reveokeSubscription: () => Promise<boolean>
        setUserUuid: (userUuid: string) => Promise<void>
        updateUser: (body: UpdateUserCommand.Request) => Promise<boolean>
    }
}
