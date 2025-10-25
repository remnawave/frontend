import { Split } from '@gfazioli/mantine-split-pane'
import { em, Grid, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'

import { CreateInfraBillingRecordDrawerWidget } from '@widgets/dashboard/infra-billing/create-infra-billing-record-modal/create-infra-billing-record.modal.widget'
import { CreateInfraBillingNodeModalWidget } from '@widgets/dashboard/infra-billing/create-infra-billing-node-modal/create-infra-billing-node.modal.widget'
import { CreateInfraProviderDrawerWidget } from '@widgets/dashboard/infra-billing/create-infra-provider-drawer/create-infra-provider.drawer.widget'
import { InfraBillingRecordsTableWidget } from '@widgets/dashboard/infra-billing/infra-billing-records-table/infra-billing-records-table.widget'
import { ViewInfraProviderDrawerWidget } from '@widgets/dashboard/infra-billing/view-infra-provider-drawer/view-infra-provider.drawer.widget'
import { InfraBillingNodesTableWidget } from '@widgets/dashboard/infra-billing/infra-billing-nodes-table/infra-billing-nodes.widget'
import { InfraProvidersTableWidget } from '@widgets/dashboard/infra-billing/infra-providers-table/infra-providers-table.widget'
import { UpdateBillingDateModalWidget } from '@widgets/dashboard/infra-billing/update-billing-date-modal'
import { LandscapeBannerShared } from '@shared/ui/landscape-banner/landscape-banner.shared'
import { StatsWidget } from '@widgets/dashboard/infra-billing/stats-widget/stats.widget'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

export const InfraBillingPageComponent = () => {
    const { t } = useTranslation()
    const isMobile = useMediaQuery(`(max-width: ${em(450)})`)
    return (
        <Page title={t('constants.infra-billing')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    {
                        label: t('constants.nodes'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.NODES
                    },
                    {
                        label: t('constants.infra-billing'),
                        href: ROUTES.DASHBOARD.CRM.INFRA_BILLING
                    }
                ]}
                title={t('constants.infra-billing')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <StatsWidget />
                        {isMobile ? (
                            <LandscapeBannerShared />
                        ) : (
                            <Stack>
                                <Split spacing="sm" variant="dotted">
                                    <Split.Pane initialWidth="60%">
                                        <InfraBillingNodesTableWidget />
                                    </Split.Pane>

                                    <Split.Resizer />

                                    <Split.Pane initialWidth="40%">
                                        <InfraBillingRecordsTableWidget />
                                    </Split.Pane>
                                </Split>

                                <InfraProvidersTableWidget />
                            </Stack>
                        )}
                    </motion.div>
                </Grid.Col>
            </Grid>

            <ViewInfraProviderDrawerWidget />
            <CreateInfraProviderDrawerWidget />
            <CreateInfraBillingRecordDrawerWidget />
            <UpdateBillingDateModalWidget />
            <CreateInfraBillingNodeModalWidget />
        </Page>
    )
}
