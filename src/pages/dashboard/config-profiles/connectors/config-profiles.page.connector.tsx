import { useGetConfigProfiles } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { ConfigPageComponent } from '../components/config-profiles.page.component'

export function ConfigProfilesPageConnector() {
    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    if (isConfigProfilesLoading || !configProfiles) {
        return <LoadingScreen />
    }

    return <ConfigPageComponent configProfiles={configProfiles.configProfiles} />
}
