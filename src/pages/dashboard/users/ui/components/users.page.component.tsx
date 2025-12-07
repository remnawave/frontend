import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stack } from '@mantine/core'

import { UserAccessibleNodesModalWidget } from '@widgets/dashboard/users/user-accessible-nodes-modal/user-accessible-nodes.modal.widget'
import { DetailedUserInfoDrawerWidget } from '@widgets/dashboard/users/detailed-user-info-drawer/detailed-user-info-drawer.widget'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { MobileWarningOverlay } from '@shared/ui/mobile-warning-overlay/mobile-warning-overlay'
import { CreateUserModalWidget } from '@widgets/dashboard/users/create-user-modal'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { UserTableWidget } from '@widgets/dashboard/users/users-table'
import { UsersMetrics } from '@widgets/dashboard/users/users-metrics'
import { LoadingScreen } from '@shared/ui'
import { Page } from '@shared/ui/page'

const DeferredUserTableWidget = () => {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShouldRender(true), 300)
        return () => clearTimeout(timer)
    }, [])

    if (!shouldRender) {
        return <LoadingScreen height="80vh" />
    }

    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        >
            <UserTableWidget />
        </motion.div>
    )
}

export default function UsersPageComponent() {
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 500px)')

    return (
        <Page title={t('constants.users')}>
            <Stack>
                {isMobile && <MobileWarningOverlay />}
                <UsersMetrics />

                <DeferredUserTableWidget />
            </Stack>

            <ViewUserModal key="view-user-modal" />
            <CreateUserModalWidget key="create-user-widget" />
            <DetailedUserInfoDrawerWidget key="detailed-user-info-drawer" />
            <UserAccessibleNodesModalWidget key="user-accessible-nodes-modal" />
            <InternalSquadsDrawerWithStore key="internal-squads-drawer-with-store" />
        </Page>
    )
}
