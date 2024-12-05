import { GetAllUsersV2Command } from '@remnawave/backend-contract'

import { GetUsersV2Params } from './get-users-v2.interface'
import { IState } from './state.interface'

export interface IActions {
    actions: {
        getBandwidthStats: () => Promise<boolean>
        getInbounds: () => Promise<boolean>
        getInitialState: () => IState
        getSystemInfo: () => Promise<boolean>
        getUsersV2: (
            params: GetUsersV2Params
        ) => Promise<GetAllUsersV2Command.Response['response'] | null>
        resetState: () => Promise<void>
    }
}
