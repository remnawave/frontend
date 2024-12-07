import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    nodes: GetAllNodesCommand.Response['response'] | undefined
}
