import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { ConfigProfilesSpotlightWidget } from '@widgets/dashboard/config-profiles/config-profiles-spotlight/config-profiles-spotlight'
import { ConfigProfilesGridWidget } from '@widgets/dashboard/config-profiles/config-profiles-grid/config-profiles-grid.widget'
import { ConfigProfilesHeaderActionButtonsFeature } from '@features/ui/dashboard/config-profiles/header-action-buttons'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { SnippetsDrawerWidget } from '@widgets/dashboard/config-profiles/snippets-drawer'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { XrayLogo } from '@shared/ui/logos'
import { Page } from '@shared/ui/page'

import { CONFIG_PROFILES_VIEW_MODE, Props } from './interfaces'

export const ConfigPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { configProfiles } = props

    const [viewMode, setViewMode] = useState<CONFIG_PROFILES_VIEW_MODE>(
        CONFIG_PROFILES_VIEW_MODE.PROFILES
    )

    const configProfileCount = configProfiles?.length ?? 0

    return (
        <Page title={t('constants.config-profiles')}>
            <PageHeaderShared
                actions={
                    <ConfigProfilesHeaderActionButtonsFeature
                        configProfileCount={configProfileCount}
                        setViewMode={setViewMode}
                        viewMode={viewMode}
                    />
                }
                icon={<XrayLogo size={24} />}
                title={t('constants.config-profiles')}
            />

            {viewMode === CONFIG_PROFILES_VIEW_MODE.SNIPPETS && (
                <SnippetsDrawerWidget fromMainView={true} />
            )}

            {viewMode === CONFIG_PROFILES_VIEW_MODE.PROFILES && (
                <ConfigProfilesGridWidget configProfiles={configProfiles} />
            )}

            {configProfileCount > 0 && (
                <ConfigProfilesSpotlightWidget configProfiles={configProfiles} />
            )}

            <RenameModalShared key="rename-config-profile-modal" renameFrom="configProfile" />
            <InternalSquadsDrawerWithStore key="internal-squads-drawer-with-store" />
        </Page>
    )
}
