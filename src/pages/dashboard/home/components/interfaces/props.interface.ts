import { GetBandwidthStatsCommand, GetStatsCommand } from '@remnawave/backend-contract'

export interface IProps {
    bandwidthStats: GetBandwidthStatsCommand.Response['response']
    systemInfo: GetStatsCommand.Response['response']
}
