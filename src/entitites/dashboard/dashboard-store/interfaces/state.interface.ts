import {
    GetAllUsersCommand,
    GetInboundsCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'
import { IInboundsHashMap } from '@/entitites/dashboard/dashboard-store/interfaces/inbounds-hash-map.interface'
import { IUsersParams } from '../interfaces'

export interface IState {
    isLoading: boolean
    isUsersLoading: boolean
    isInboundsLoading: boolean
    systemInfo: GetStatsCommand.Response['response'] | null
    users: GetAllUsersCommand.Response['response']['users'] | null
    usersParams: IUsersParams
    totalUsers: number
    inbounds: GetInboundsCommand.Response['response'] | null
    inboundsHashMap: Map<string, IInboundsHashMap> | null
}
