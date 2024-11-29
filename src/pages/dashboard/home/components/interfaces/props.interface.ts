import { GetStatsCommand } from '@remnawave/backend-contract'

export interface IProps {
    systemInfo: GetStatsCommand.Response['response']
}
