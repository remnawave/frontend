import { useGetFullInbounds } from '@shared/api/hooks'

import InboundsPageComponent from '../components/inbounds.page.component'

export function InboundsPageConnector() {
    const { data: inbounds, isLoading: isInboundsLoading } = useGetFullInbounds()

    return <InboundsPageComponent inbounds={inbounds} isInboundsLoading={isInboundsLoading} />
}
