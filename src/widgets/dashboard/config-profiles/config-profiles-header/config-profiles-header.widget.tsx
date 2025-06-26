import { useTranslation } from 'react-i18next'

import { ConfigProfilesHeaderActionButtonsFeature } from '@features/ui/dashboard/config-profiles/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function ConfigProfilesHeaderWidget() {
    const { t } = useTranslation()

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<ConfigProfilesHeaderActionButtonsFeature />}
                description={t('config-profiles-header.widget.list-of-all-config-profiles')}
                title={t('constants.config-profiles')}
            />
            <DataTableShared.Content />
        </DataTableShared.Container>
    )
}
