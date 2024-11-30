import {
    useDashboardStoreActions,
    useDSInbounds
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import {
    useHostsStoreActions,
    useHostsStoreHosts
} from '@entitites/dashboard/hosts/hosts-store/hosts-store'
import HostsPageComponent from '@pages/dashboard/hosts/ui/components/hosts.page.component'
import { useEffect } from 'react'

export function HostsPageConnector() {
    const actions = useHostsStoreActions()
    const dsActions = useDashboardStoreActions()

    const hosts = useHostsStoreHosts()
    const inbounds = useDSInbounds()

    useEffect(() => {
        ;(async () => {
            await actions.getHosts()
            await dsActions.getInbounds()
        })()
        return () => {
            actions.resetState()
            dsActions.resetState()
        }
    }, [])

    return <HostsPageComponent hosts={hosts} inbounds={inbounds} />
}
