import { GetRemnawaveSettingsCommand } from '@remnawave/backend-contract'
import { Container, Grid } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { AuthentificationSettingsCardWidget } from '@widgets/remnawave-settings/authentification-settings-card/authentification-settings-card.widget'
import { BrandingSettingsCardWidget } from '@widgets/remnawave-settings/branding-settings-card/branding-settings-card.widget'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

interface IProps {
    remnawaveSettings: GetRemnawaveSettingsCommand.Response['response']
}
export const RemnawaveSettingsPageComponent = (props: IProps) => {
    const { remnawaveSettings } = props

    const { t } = useTranslation()

    if (!remnawaveSettings) {
        return <LoadingScreen />
    }

    if (
        !remnawaveSettings.oauth2Settings ||
        !remnawaveSettings.passkeySettings ||
        !remnawaveSettings.passwordSettings ||
        !remnawaveSettings.tgAuthSettings ||
        !remnawaveSettings.brandingSettings
    ) {
        return <LoadingScreen />
    }

    const sharedSpan = {
        base: 12,
        xs: 12,
        sm: 12,
        md: 6
    }

    return (
        <Page title={t('constants.remnawave-settings')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.remnawave-settings') }
                ]}
                title={t('constants.remnawave-settings')}
            />
            <Container fluid p={0} size="xl">
                <Grid
                    breakpoints={{
                        xs: '320px',
                        sm: '800px',
                        md: '1000px',
                        lg: '1200px',
                        xl: '1800px'
                    }}
                    gutter="xl"
                    type="container"
                >
                    <Grid.Col span={sharedSpan}>
                        <AuthentificationSettingsCardWidget
                            oauth2Settings={remnawaveSettings.oauth2Settings}
                            passkeySettings={remnawaveSettings.passkeySettings}
                            passwordSettings={remnawaveSettings.passwordSettings}
                            tgAuthSettings={remnawaveSettings.tgAuthSettings}
                        />
                    </Grid.Col>

                    <Grid.Col span={sharedSpan}>
                        <BrandingSettingsCardWidget
                            brandingSettings={remnawaveSettings.brandingSettings}
                        />
                    </Grid.Col>
                </Grid>
            </Container>
        </Page>
    )
}
