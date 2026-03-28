import { useGetNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import TorrentBlockerReportsPageComponent from '../components/torrent-blocker-reports.page.component'

export function TorrentBlockerReportsPageConnector() {
    const { isLoading: isNodesLoading } = useGetNodes()

    if (isNodesLoading) {
        return <LoadingScreen />
    }

    return <TorrentBlockerReportsPageComponent />
}
