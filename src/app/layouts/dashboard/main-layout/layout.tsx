import { useMediaQuery } from '@mantine/hooks'

import { useIsMobile } from '@shared/hooks'
import { HeaderControls } from '@shared/ui/header-buttons'
import { QuickLauncher } from '@shared/ui/quick-launcher'

import { useIsLoadingRemnawaveUpdates, useRemnawaveInfo } from '@entities/dashboard/updates-store'
import { useExperimentalFeature } from '@entities/dashboard/view-preferences-store'

import { DASHBOARD_LINKS } from './layout-shared'
import { CompactLayout } from './layout-variants/compact.layout'
import { MobileLayout } from './layout-variants/mobile.layout'
import { SidebarLayout } from './layout-variants/sidebar.layout'
import { useQuickLauncherRoutes } from './menu-sections/use-quick-launcher-routes'

import '@shared/_modals/modal-registry'

export function MainLayout() {
    const isLegacyLayoutStyle = useExperimentalFeature('legacyLayoutStyle')

    const isMobile = useIsMobile()

    const isHiResDesktop = useMediaQuery(`(min-width: 2048px)`, undefined, {
        getInitialValueInEffect: false
    })

    const remnawaveInfo = useRemnawaveInfo()
    const isLoadingUpdates = useIsLoadingRemnawaveUpdates()
    const launcherRoutes = useQuickLauncherRoutes()

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

    return (
        <>
            {isLegacyLayoutStyle ? (
                <SidebarLayout headerControls={headerControls} />
            ) : (
                <CompactLayout headerControls={headerControls} isHiResDesktop={isHiResDesktop} />
            )}
            <QuickLauncher routes={launcherRoutes} />
        </>
    )
}
