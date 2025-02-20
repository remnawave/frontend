import { useTranslation } from 'react-i18next'

import { ApiTokensHeaderActionButtonsFeature } from '@features/ui/dashboard/api-tokens/api-tokens-header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function ApiTokensPageHeaderWidget() {
    const { t } = useTranslation()

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<ApiTokensHeaderActionButtonsFeature />}
                description={t('api-tokens-page-header.widget.list-of-all-api-tokens')}
                title={t('constants.api-tokens')}
            />
        </DataTableShared.Container>
    )
}
