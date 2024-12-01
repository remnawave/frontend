import { GetAllHostsCommand } from '@remnawave/backend-contract'

export interface IProps {
    index: number
    item: GetAllHostsCommand.Response['response'][number]
}
