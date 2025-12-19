import { useGetSubscriptionPageConfigs } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { SubpageConfigBasePageComponent } from '../components/subpage-config-base-page.component'

export function SubpageConfigBasePageConnector() {
    const { data: subpageConfigs, isLoading: isSubpageConfigsLoading } =
        useGetSubscriptionPageConfigs({})

    if (isSubpageConfigsLoading || !subpageConfigs) {
        return <LoadingScreen text="Loading subpage configs..." />
    }

    return <SubpageConfigBasePageComponent configs={subpageConfigs.configs} />
}
