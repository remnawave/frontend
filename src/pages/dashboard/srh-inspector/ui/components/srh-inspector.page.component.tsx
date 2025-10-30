import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { motion } from 'framer-motion'
import { Stack } from '@mantine/core'

import { UserAccessibleNodesModalWidget } from '@widgets/dashboard/users/user-accessible-nodes-modal/user-accessible-nodes.modal.widget'
import { DetailedUserInfoDrawerWidget } from '@widgets/dashboard/users/detailed-user-info-drawer/detailed-user-info-drawer.widget'
import { MobileWarningOverlay } from '@shared/ui/mobile-warning-overlay/mobile-warning-overlay'
import { SrhInspectorTableWidget } from '@widgets/dashboard/srh-inspector/srh-inspector-table'
import { SrhInspectorMetrics } from '@widgets/dashboard/srh-inspector/srh-inspector-metrics'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { Page } from '@shared/ui'

export default function SrhInspectorPageComponent() {
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 500px)')

    return (
        <Page title={t('constants.srh-inspector')}>
            <Stack>
                {isMobile && <MobileWarningOverlay />}
                <SrhInspectorMetrics />

                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
                >
                    <SrhInspectorTableWidget />
                </motion.div>
            </Stack>

            <ViewUserModal key="view-user-modal" />
            <DetailedUserInfoDrawerWidget key="detailed-user-info-drawer" />
            <UserAccessibleNodesModalWidget key="user-accessible-nodes-modal" />
        </Page>
    )
}
