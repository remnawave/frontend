import { GetConfigProfileByUuidCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Grid } from '@mantine/core'

import { ConfigProfileDetailHeaderWidget } from '@widgets/dashboard/config-profiles/config-profile-detail-header'
import { ConfigEditorWidget } from '@widgets/dashboard/config-profiles/config-editor/config-editor.widget'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

interface Props {
    configProfile: GetConfigProfileByUuidCommand.Response['response']
}

export const ConfigProfileByUuidPageComponent = (props: Props) => {
    const { configProfile } = props

    const { t } = useTranslation()

    return (
        <Page title={t('constants.config-profiles')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    {
                        label: t('constants.config-profiles'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES
                    },
                    { label: configProfile.name }
                ]}
                title={configProfile.name}
            />

            <Grid>
                <Grid.Col span={12}>
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ConfigProfileDetailHeaderWidget configProfile={configProfile} />
                    </motion.div>
                </Grid.Col>
                <Grid.Col span={12}>
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <ConfigEditorWidget configProfile={configProfile} />
                    </motion.div>
                </Grid.Col>
            </Grid>
        </Page>
    )
}
