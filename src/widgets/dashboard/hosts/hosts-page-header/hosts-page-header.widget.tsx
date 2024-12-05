import { HeaderActionButtonsFeature } from '@features/ui/dashboard/hosts/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

import { IProps } from './interfaces'

export function HostsPageHeaderWidget(props: IProps) {
    const { inbounds } = props

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<HeaderActionButtonsFeature inbounds={inbounds || []} />}
                description="List of all hosts"
                title="Hosts"
            />
        </DataTableShared.Container>
    )
}
