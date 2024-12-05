import { IState } from './state.interface'

export interface IActions {
    actions: {
        changeModalState: (state: boolean) => void
        getInitialState: () => IState
        resetState: () => Promise<void>
    }
}
