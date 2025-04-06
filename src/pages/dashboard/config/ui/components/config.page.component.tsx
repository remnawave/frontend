import { useTranslation } from 'react-i18next'
import { Divider } from '@mantine/core'

import { ConfigEditorWidget } from '@widgets/dashboard/config/config-editor/config-editor.widget'
import { KeypairWidget } from '@widgets/dashboard/config/keypair'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const ConfigPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { config } = props

    return (
        <Page title={t('constants.config')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    { label: t('constants.config'), href: ROUTES.DASHBOARD.MANAGEMENT.CONFIG }
                ]}
                title={t('constants.config')}
            />
            <ConfigEditorWidget config={config} />
            <Divider mb="md" mt="md" size="md" />
            <KeypairWidget />
        </Page>
    )
}
