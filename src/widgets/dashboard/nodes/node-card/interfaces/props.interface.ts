import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    isDragOverlay?: boolean
    node: GetAllNodesCommand.Response['response'][number]
}
