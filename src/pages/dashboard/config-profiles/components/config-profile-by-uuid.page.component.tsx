import { GetConfigProfileByUuidCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'

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

                    {
                        label: t('constants.config-profiles'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES
                    },
                    { label: configProfile.name }
                ]}
                title={configProfile.name}
            />

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <ConfigEditorWidget configProfile={configProfile} />
            </motion.div>
        </Page>
    )
}
