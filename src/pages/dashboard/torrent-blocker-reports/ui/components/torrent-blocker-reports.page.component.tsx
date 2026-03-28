import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Stack } from '@mantine/core'

import { UserSubscriptionRequestsDrawerWidget } from '@widgets/dashboard/users/user-subscription-requests-drawer/user-subscription-requests-drawer.widget'
import { UserTorrentBlockerReportsDrawerWidget } from '@widgets/dashboard/users/user-torrent-blocker-reports/user-torrent-blocker-reports.drawer.widget'
import { UserAccessibleNodesModalWidget } from '@widgets/dashboard/users/user-accessible-nodes-modal/user-accessible-nodes.modal.widget'
import { DetailedUserInfoDrawerWidget } from '@widgets/dashboard/users/detailed-user-info-drawer/detailed-user-info-drawer.widget'
import { UserHwidDevicesDrawerWidget } from '@widgets/dashboard/users/user-hwid-devices-drawer/user-hwid-devices.drawer.widget'
import { TorrentBlockerReportsTableWidget } from '@widgets/dashboard/torrent-blocker-reports/torrent-blocker-reports-table'
import { TorrentBlockerStatsWidget } from '@widgets/dashboard/torrent-blocker-reports/torrent-blocker-stats'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { Page } from '@shared/ui'

export default function TorrentBlockerReportsPageComponent() {
    const { t } = useTranslation()

    return (
        <Page title={t('constants.tb-reports')}>
            <Stack>
                <TorrentBlockerStatsWidget />

                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
                >
                    <TorrentBlockerReportsTableWidget />
                </motion.div>
            </Stack>

            <ViewUserModal key="view-user-modal" />
            <DetailedUserInfoDrawerWidget key="detailed-user-info-drawer" />
            <UserAccessibleNodesModalWidget key="user-accessible-nodes-modal" />
            <InternalSquadsDrawerWithStore key="internal-squads-drawer-with-store" />
            <UserHwidDevicesDrawerWidget key="user-hwid-devices-drawer" />
            <UserTorrentBlockerReportsDrawerWidget key="user-torrent-blocker-reports-drawer" />
            <UserSubscriptionRequestsDrawerWidget key="user-subscription-requests-drawer" />
        </Page>
    )
}
