import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        getNodesStats: () => Promise<boolean>
        resetState: () => Promise<void>
    }
}
