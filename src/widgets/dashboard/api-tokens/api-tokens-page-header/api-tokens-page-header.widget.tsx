import { ApiTokensHeaderActionButtonsFeature } from '@features/ui/dashboard/api-tokens/api-tokens-header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function ApiTokensPageHeaderWidget() {
    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<ApiTokensHeaderActionButtonsFeature />}
                description="List of all API tokens"
                title="API Tokens"
            />
        </DataTableShared.Container>
    )
}
