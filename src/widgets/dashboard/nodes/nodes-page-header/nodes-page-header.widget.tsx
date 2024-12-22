import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function NodesPageHeaderWidget() {
    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<NodesHeaderActionButtonsFeature />}
                description="List of all nodes"
                title="Nodes"
            />
        </DataTableShared.Container>
    )
}
