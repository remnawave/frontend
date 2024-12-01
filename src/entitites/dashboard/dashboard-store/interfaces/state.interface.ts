import {
    GetAllUsersCommand,
    GetInboundsCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'

import { IInboundsHashMap } from '@/entitites/dashboard/dashboard-store/interfaces/inbounds-hash-map.interface'

import { IUsersParams } from './users-params.interface'

export interface IState {
    inbounds: GetInboundsCommand.Response['response'] | null
    inboundsHashMap: Map<string, IInboundsHashMap> | null
    isInboundsLoading: boolean
    isLoading: boolean
    isUsersLoading: boolean
    systemInfo: GetStatsCommand.Response['response'] | null
    totalUsers: number
    users: GetAllUsersCommand.Response['response']['users'] | null
    usersParams: IUsersParams
}
