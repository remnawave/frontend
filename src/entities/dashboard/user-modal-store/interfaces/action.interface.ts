import { IState } from './state.interface'

export interface IActions {
    actions: {
        changeDetailedUserInfoDrawerState: (state: boolean) => void
        changeModalState: (state: boolean) => void
        clearModalState: () => void
        getInitialState: () => IState
        resetState: () => Promise<void>
        setDrawerUserUuid: (userUuid: string) => Promise<void>
        setUserUuid: (userUuid: string) => Promise<void>
    }
}
