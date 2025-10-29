import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Grid } from '@mantine/core'

import { ExternalSquadsGridWidget } from '@widgets/dashboard/external-squads/external-squads-grid/external-squads-grid.widget'
import { ExternalSquadsHeaderActionButtonsFeature } from '@features/ui/dashboard/external-squads/header-action-buttons'
import { ExternalSquadsDrawer } from '@widgets/dashboard/external-squads/external-squads-drawer'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { DataTableShared } from '@shared/ui/table'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const ExternalSquadsPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { externalSquads } = props

    return (
        <Page title={t('constants.internal-squads')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    {
                        label: t('constants.external-squads'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.EXTERNAL_SQUADS
                    }
                ]}
                title={t('constants.external-squads')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <DataTableShared.Container mb="xl">
                        <DataTableShared.Title
                            actions={<ExternalSquadsHeaderActionButtonsFeature />}
                            title={t('constants.external-squads')}
                        />
                    </DataTableShared.Container>

                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ExternalSquadsGridWidget externalSquads={externalSquads} />
                    </motion.div>
                </Grid.Col>
            </Grid>
            <ExternalSquadsDrawer />
            <RenameModalShared key="rename-external-squad-modal" renameFrom="externalSquad" />
        </Page>
    )
}
