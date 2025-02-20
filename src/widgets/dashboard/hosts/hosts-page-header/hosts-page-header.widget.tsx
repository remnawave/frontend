import { useTranslation } from 'react-i18next'

import { HeaderActionButtonsFeature } from '@features/ui/dashboard/hosts/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

import { IProps } from './interfaces'

export function HostsPageHeaderWidget(props: IProps) {
    const { t } = useTranslation()

    const { inbounds } = props

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<HeaderActionButtonsFeature inbounds={inbounds || []} />}
                description={t('hosts-page-header.widget.list-of-all-hosts')}
                title={t('constants.hosts')}
            />
        </DataTableShared.Container>
    )
}
