import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { DataTableShared } from '@/shared/ui/table'

import { IProps } from './interfaces'

export function NodesPageHeaderWidget(props: IProps) {
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
