import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Grid } from '@mantine/core'

import { InternalSquadAccessibleNodesModalWidget } from '@widgets/dashboard/internal-squads/internal-squad-accessible-nodes-modal/internal-squad-accessible-nodes.modal.widget'
import { InternalSquadsHeaderWidget } from '@widgets/dashboard/internal-squads/internal-squads-header-widget/internal-squads-header.widget'
import { InternalSquadsGridWidget } from '@widgets/dashboard/internal-squads/internal-squads-grid/internal-squads-grid.widget'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const InternalSquadsPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { internalSquads } = props

    return (
        <Page title={t('constants.internal-squads')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    {
                        label: t('constants.internal-squads'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.INTERNAL_SQUADS
                    }
                ]}
                title={t('constants.internal-squads')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <InternalSquadsHeaderWidget />

                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <InternalSquadsGridWidget internalSquads={internalSquads} />
                    </motion.div>
                </Grid.Col>
            </Grid>
            <RenameModalShared key="rename-internal-squad-modal" renameFrom="internalSquad" />
            <InternalSquadAccessibleNodesModalWidget key="internal-squad-accessible-nodes-modal" />
        </Page>
    )
}
