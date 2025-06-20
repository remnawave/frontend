import { InternalSquadsHeaderActionButtonsFeature } from '@features/ui/dashboard/internal-squads/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function InternalSquadsHeaderWidget() {
    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<InternalSquadsHeaderActionButtonsFeature />}
                description="List of all internal squads"
                title="Internal Squads"
            />
            <DataTableShared.Content />
        </DataTableShared.Container>
    )
}
