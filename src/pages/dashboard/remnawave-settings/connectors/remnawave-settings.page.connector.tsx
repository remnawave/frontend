import { useGetApiTokens, useGetRemnawaveSettings } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

import { RemnawaveSettingsPageComponent } from '../components'

export const RemnawaveSettingsConnector = () => {
    const { data: remnawaveSettings, isLoading: isRemnawaveSettingsLoading } =
        useGetRemnawaveSettings()
    const { data: apiTokensData, isLoading: isApiTokensLoading } = useGetApiTokens()

    if (isRemnawaveSettingsLoading || isApiTokensLoading || !remnawaveSettings || !apiTokensData) {
        return <LoadingScreen />
    }

    return (
        <RemnawaveSettingsPageComponent
            apiTokensData={apiTokensData}
            remnawaveSettings={remnawaveSettings}
        />
    )
}
