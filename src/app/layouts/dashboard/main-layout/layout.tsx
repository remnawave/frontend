import { useMediaQuery } from '@mantine/hooks'

import { useIsMobile } from '@shared/hooks'
import { HeaderControls } from '@shared/ui/header-buttons'

import { useIsLoadingRemnawaveUpdates, useRemnawaveInfo } from '@entities/dashboard/updates-store'
import { useExperimentalFeature } from '@entities/dashboard/view-preferences-store'

import { DASHBOARD_LINKS } from './layout-shared'
import { CompactLayout } from './layout-variants/compact.layout'
import { MobileLayout } from './layout-variants/mobile.layout'
import { SidebarLayout } from './layout-variants/sidebar.layout'

import '@shared/_modals/modal-registry'

export function MainLayout() {
    const isLegacyLayoutStyle = useExperimentalFeature('legacyLayoutStyle')

    const isMobile = useIsMobile()

    const isHiResDesktop = useMediaQuery(`(min-width: 2048px)`, undefined, {
        getInitialValueInEffect: false
    })

    const remnawaveInfo = useRemnawaveInfo()
    const isLoadingUpdates = useIsLoadingRemnawaveUpdates()

    const headerControls = (
        <HeaderControls
            {...DASHBOARD_LINKS}
            isGithubLoading={isLoadingUpdates}
            stars={remnawaveInfo.starsCount || undefined}
            withGithub={!isMobile}
            withPrime
            withRecap={!isMobile}
            withSupport={!isMobile}
            withTelegram={!isMobile}
        />
    )

    if (isMobile) {
        return (
            <MobileLayout
                headerControls={headerControls}
                isSocialButtons={isMobile}
                isLoadingUpdates={isLoadingUpdates}
                remnawaveInfo={remnawaveInfo}
            />
        )
    }

    if (isLegacyLayoutStyle) {
        return <SidebarLayout headerControls={headerControls} />
    }

    return <CompactLayout headerControls={headerControls} isHiResDesktop={isHiResDesktop} />
}
