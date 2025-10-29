import { useTranslation } from 'react-i18next'

import { NodesHeaderActionButtonsFeature } from '@features/ui/dashboard/nodes/nodes-header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function NodesPageHeaderWidget() {
    const { t } = useTranslation()

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<NodesHeaderActionButtonsFeature />}
                title={t('constants.nodes')}
            />
        </DataTableShared.Container>
    )
}
