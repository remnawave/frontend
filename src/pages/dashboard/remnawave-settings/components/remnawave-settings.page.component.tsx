import { Container } from '@mantine/core'
import { GetApiTokensCommand, GetRemnawaveSettingsCommand } from '@remnawave/backend-contract'
import { ApiTokensCardWidget } from '@widgets/remnawave-settings/api-tokens-card/api-tokens-card.widget'
import { AuthentificationSettingsCardWidget } from '@widgets/remnawave-settings/authentification-settings-card/authentification-settings-card.widget'
import { BackendToolsCardWidget } from '@widgets/remnawave-settings/backend-tools-card/backend-tools-card.widget'
import { BrandingSettingsCardWidget } from '@widgets/remnawave-settings/branding-settings-card/branding-settings-card.widget'
import { ExperimentalSettingsCardWidget } from '@widgets/remnawave-settings/experimental-settings-card/experimental-settings-card.widget'
import { useTranslation } from 'react-i18next'
import Masonry from 'react-layout-masonry'

import { LoadingScreen, Logo, Page, PageHeaderShared } from '@shared/ui'

interface IProps {
    apiTokensData: GetApiTokensCommand.Response['response']
    remnawaveSettings: GetRemnawaveSettingsCommand.Response['response']
}

export const RemnawaveSettingsPageComponent = (props: IProps) => {
    const { remnawaveSettings, apiTokensData } = props

    const { t } = useTranslation()

    if (!remnawaveSettings || !apiTokensData) {
        return <LoadingScreen />
    }

    if (
        !remnawaveSettings.oauth2Settings ||
        !remnawaveSettings.passkeySettings ||
        !remnawaveSettings.passwordSettings ||
        !remnawaveSettings.brandingSettings
    ) {
        return <LoadingScreen />
    }

    return (
        <Page title={t('constants.remnawave-settings')}>
            <PageHeaderShared icon={<Logo size={24} />} title={t('constants.remnawave-settings')} />
            <Container fluid p={0} size="xl">
                <Masonry columns={{ 300: 1, 1400: 2, 2000: 3, 3000: 4 }} gap={16}>
                    <AuthentificationSettingsCardWidget
                        oauth2Settings={remnawaveSettings.oauth2Settings}
                        passkeySettings={remnawaveSettings.passkeySettings}
                        passwordSettings={remnawaveSettings.passwordSettings}
                    />
                    <ApiTokensCardWidget apiTokensData={apiTokensData} />
                    <BackendToolsCardWidget />
                    <BrandingSettingsCardWidget
                        brandingSettings={remnawaveSettings.brandingSettings}
                    />
                    <ExperimentalSettingsCardWidget />
                </Masonry>
            </Container>
        </Page>
    )
}
