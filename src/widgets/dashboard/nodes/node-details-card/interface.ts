import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    fetchedNode?: GetAllNodesCommand.Response['response'][number]
    node: GetAllNodesCommand.Response['response'][number]
}
