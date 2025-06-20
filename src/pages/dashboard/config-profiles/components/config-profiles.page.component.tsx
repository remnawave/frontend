import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Grid } from '@mantine/core'

import { ConfigProfilesHeaderWidget } from '@widgets/dashboard/config-profiles/config-profiles-header/config-profiles-header.widget'
import { ConfigProfilesGridWidget } from '@widgets/dashboard/config-profiles/config-profiles-grid/config-profiles-grid.widget'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const ConfigPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { configProfiles } = props

    return (
        <Page title={t('constants.config')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    { label: 'Config Profiles', href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES }
                ]}
                title="Config Profiles"
            />

            <Grid>
                <Grid.Col span={12}>
                    <ConfigProfilesHeaderWidget />

                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ConfigProfilesGridWidget configProfiles={configProfiles} />
                    </motion.div>
                </Grid.Col>
            </Grid>
        </Page>
    )
}
