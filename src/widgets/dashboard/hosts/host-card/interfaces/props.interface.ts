import { GetAllHostsCommand } from '@remnawave/backend-contract'

export interface IProps {
    item: GetAllHostsCommand.Response['response'][number]
    index: number
}
