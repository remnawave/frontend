import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        resetState: () => Promise<void>

        toggleCreateModal: (isOpen: boolean) => void
    }
}
