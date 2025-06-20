import { ConfigProfilesHeaderActionButtonsFeature } from '@features/ui/dashboard/config-profiles/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function ConfigProfilesHeaderWidget() {
    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<ConfigProfilesHeaderActionButtonsFeature />}
                description="List of all config profiles"
                title="Config Profiles"
            />
            <DataTableShared.Content />
        </DataTableShared.Container>
    )
}
