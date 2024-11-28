import { GetStatsCommand } from '@remnawave/backend-contract'
import { IBreadcrumb } from '@/shared/interfaces'

export interface IProps {
    systemInfo: GetStatsCommand.Response['response']
    breadcrumbs: IBreadcrumb[]
}
