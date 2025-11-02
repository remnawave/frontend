import { useTranslation } from 'react-i18next'

import { ConfigProfilesGridWidget } from '@widgets/dashboard/config-profiles/config-profiles-grid/config-profiles-grid.widget'
import { ConfigProfilesHeaderActionButtonsFeature } from '@features/ui/dashboard/config-profiles/header-action-buttons'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { XrayLogo } from '@shared/ui/logos'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const ConfigPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { configProfiles } = props

    return (
        <Page title={t('constants.config-profiles')}>
            <PageHeaderShared
                actions={<ConfigProfilesHeaderActionButtonsFeature />}
                icon={<XrayLogo size={24} />}
                title={t('constants.config-profiles')}
            />

            <ConfigProfilesGridWidget configProfiles={configProfiles} />

            <RenameModalShared key="rename-config-profile-modal" renameFrom="configProfile" />
        </Page>
    )
}
