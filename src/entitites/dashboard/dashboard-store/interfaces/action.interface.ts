import { IState } from './state.interface'
import { IUsersParams } from './users-params.interface'

export interface IActions {
    actions: {
        getSystemInfo: () => Promise<boolean>
        getUsers: (params?: Partial<IUsersParams>) => Promise<boolean>
        getInbounds: () => Promise<boolean>
        getInitialState: () => IState
        resetState: () => Promise<void>
    }
}
