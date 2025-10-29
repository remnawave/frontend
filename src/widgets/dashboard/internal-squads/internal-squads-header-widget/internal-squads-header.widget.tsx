import { useTranslation } from 'react-i18next'

import { InternalSquadsHeaderActionButtonsFeature } from '@features/ui/dashboard/internal-squads/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function InternalSquadsHeaderWidget() {
    const { t } = useTranslation()

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<InternalSquadsHeaderActionButtonsFeature />}
                title={t('constants.internal-squads')}
            />
        </DataTableShared.Container>
    )
}
