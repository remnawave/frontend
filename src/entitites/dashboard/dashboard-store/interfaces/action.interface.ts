import { IUsersParams } from './users-params.interface'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInbounds: () => Promise<boolean>
        getInitialState: () => IState
        getSystemInfo: () => Promise<boolean>
        getUsers: (params?: Partial<IUsersParams>) => Promise<boolean>
        resetState: () => Promise<void>
    }
}
