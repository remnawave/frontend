import {
    GetBandwidthStatsCommand,
    GetInboundsCommand,
    GetStatsCommand
} from '@remnawave/backend-contract'

import { IInboundsHashMap } from '@entities/dashboard/dashboard-store/interfaces/inbounds-hash-map.interface'

export interface IState {
    bandwidthStats: GetBandwidthStatsCommand.Response['response'] | null
    inbounds: GetInboundsCommand.Response['response'] | null
    inboundsHashMap: Map<string, IInboundsHashMap> | null
    isInboundsLoading: boolean
    isLoading: boolean
    isUsersLoading: boolean
    systemInfo: GetStatsCommand.Response['response'] | null
}
