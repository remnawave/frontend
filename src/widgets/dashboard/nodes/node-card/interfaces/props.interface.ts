import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    node: GetAllNodesCommand.Response['response'][number]
}
