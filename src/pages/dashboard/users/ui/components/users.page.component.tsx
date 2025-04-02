import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stack } from '@mantine/core'

import { DetailerUserInfoDrawerWidget } from '@widgets/dashboard/users/detailed-user-info-drawer/detailed-user-info-drawer.widget'
import { CreateUserModalWidget } from '@widgets/dashboard/users/create-user-modal'
import { ViewUserModal } from '@widgets/dashboard/users/view-user-modal'
import { UserTableWidget } from '@widgets/dashboard/users/users-table'
import { UsersMetrics } from '@widgets/dashboard/users/users-metrics'
import { PageHeader } from '@shared/ui/page-header'
import { ROUTES } from '@shared/constants'
import { LoadingScreen } from '@shared/ui'
import { Page } from '@shared/ui/page'

const DeferredUserTableWidget = () => {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setShouldRender(true), 200)
        return () => clearTimeout(timer)
    }, [])

    if (!shouldRender) {
        return <LoadingScreen height="60vh" />
    }

    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <UserTableWidget />
        </motion.div>
    )
}

export default function UsersPageComponent() {
    const { t } = useTranslation()

    return (
        <Page title={t('constants.users')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    { label: t('constants.users') }
                ]}
                title={t('constants.users')}
            />

            <Stack>
                <UsersMetrics />

                <DeferredUserTableWidget />
            </Stack>

            <ViewUserModal key="view-user-modal" />
            <CreateUserModalWidget key="create-user-widget" />
            <DetailerUserInfoDrawerWidget key="detailed-user-info-drawer" />
        </Page>
    )
}
