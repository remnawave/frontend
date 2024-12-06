import HostsPageComponent from '@pages/dashboard/hosts/ui/components/hosts.page.component'
import { useGetHosts, useGetInbounds } from '@shared/api/hooks'

export function HostsPageConnector() {
    const { data: inbounds } = useGetInbounds()
    const { data: hosts } = useGetHosts()

    return <HostsPageComponent hosts={hosts} inbounds={inbounds} />
}
