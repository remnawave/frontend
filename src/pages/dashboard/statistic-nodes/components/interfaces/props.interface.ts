import { GetNodesStatisticsCommand } from '@remnawave/backend-contract'

export interface IProps {
    nodesStats: GetNodesStatisticsCommand.Response['response']
}
