import { CreateUserCommand } from '@remnawave/backend-contract'

export interface IActions {
    actions: {
        createUser: (body: CreateUserCommand.Request) => Promise<boolean>
        changeModalState: (state: boolean) => void
        resetState: () => Promise<void>
    }
}
