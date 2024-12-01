import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { DataTable } from '@/shared/ui/stuff/data-table'

import { IProps } from './interfaces'

export function NodesPageHeaderWidget(props: IProps) {
    return (
        <DataTable.Container mb="xl">
            <DataTable.Title
                actions={<NodesHeaderActionButtonsFeature />}
                description="List of all nodes"
                title="Nodes"
            />
        </DataTable.Container>
    )
}
