import { useGetConfigProfiles, useGetSnippets } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { ConfigPageComponent } from '../components/config-profiles.page.component'

export function ConfigProfilesPageConnector() {
    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()
    const { data: snippets, isLoading: isSnippetsLoading } = useGetSnippets({})

    if (isConfigProfilesLoading || isSnippetsLoading || !configProfiles || !snippets) {
        return <LoadingScreen />
    }

    return <ConfigPageComponent configProfiles={configProfiles.configProfiles} />
}
