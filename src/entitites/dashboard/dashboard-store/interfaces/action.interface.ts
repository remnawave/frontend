import { IUsersParams } from './users-params.interface'

export interface IActions {
    actions: {
        getSystemInfo: () => Promise<boolean>
        getUsers: (params?: Partial<IUsersParams>) => Promise<boolean>
        getInbounds: () => Promise<boolean>
        resetState: () => Promise<void>
    }
}
