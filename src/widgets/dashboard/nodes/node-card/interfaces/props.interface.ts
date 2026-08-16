import { GetNodesCommand } from '@remnawave/backend-contract'

export interface IProps {
    disableReordering?: boolean
    handleViewNode: (nodeUuid: string) => void
    index: number
    isDragOverlay?: boolean
    isMobile: boolean
    node: GetNodesCommand.Response['response'][number]
    integrationsNames: string[]
    pluginsName: string | undefined
}
