import { Group } from '@mantine/core'
import { HeaderActionButtonsFeature } from '@features/ui/dashboard/hosts/header-action-buttons'
import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { DataTable } from '@/shared/ui/stuff/data-table'
import { IProps } from './interfaces'

export function NodesPageHeaderWidget(props: IProps) {
    return (
        <DataTable.Container mb="xl">
            <DataTable.Title
                title="Nodes"
                description="List of all nodes"
                actions={<NodesHeaderActionButtonsFeature />}
            />
        </DataTable.Container>
    )
}
