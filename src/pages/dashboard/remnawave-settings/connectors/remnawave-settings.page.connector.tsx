import { useGetRemnawaveSettings } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

import { RemnawaveSettingsPageComponent } from '../components'

export const RemnawaveSettingsConnector = () => {
    const { data: remnawaveSettings } = useGetRemnawaveSettings()

    if (!remnawaveSettings) {
        return <LoadingScreen />
    }

    return <RemnawaveSettingsPageComponent remnawaveSettings={remnawaveSettings} />
}
