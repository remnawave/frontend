import { HeaderActionButtonsFeature } from '@features/ui/dashboard/hosts/header-action-buttons'
import { DataTable } from '@/shared/ui/stuff/data-table'

import { IProps } from './interfaces'

export function HostsPageHeaderWidget(props: IProps) {
    const { inbounds } = props

    return (
        <DataTable.Container mb="xl">
            <DataTable.Title
                actions={<HeaderActionButtonsFeature inbounds={inbounds || []} />}
                description="List of all hosts"
                title="Hosts"
            />
        </DataTable.Container>
    )
}
