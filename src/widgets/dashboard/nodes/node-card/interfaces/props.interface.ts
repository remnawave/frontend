import { GetAllNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    handleViewNode: (nodeUuid: string) => void
    isDragOverlay?: boolean
    isMobile: boolean
    node: GetAllNodesCommand.Response['response'][number]
}
