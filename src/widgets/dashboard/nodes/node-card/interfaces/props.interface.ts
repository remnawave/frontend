import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    index: number
    node: GetAllNodesCommand.Response['response'][number]
}
