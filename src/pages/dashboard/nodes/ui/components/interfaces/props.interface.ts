import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    isLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | undefined
}
