import { GetNodesStatisticsCommand } from '@remnawave/backend-contract'

export interface IState {
    isNodeStatsLoading: boolean
    nodesStats: GetNodesStatisticsCommand.Response['response'] | null
}
