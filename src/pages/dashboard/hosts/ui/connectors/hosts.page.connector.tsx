import { useEffect } from 'react'

import {
    useHostsStoreCreateModalIsOpen,
    useHostsStoreEditModalIsOpen
} from '@entities/dashboard/hosts/hosts-store'
import HostsPageComponent from '@pages/dashboard/hosts/ui/components/hosts.page.component'
import { QueryKeys, useGetHosts, useGetInbounds } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

export function HostsPageConnector() {
    const { data: inbounds } = useGetInbounds()
    const {
        data: hosts,

        isLoading: isHostsLoading
    } = useGetHosts()

    const isCreateModalOpen = useHostsStoreCreateModalIsOpen()
    const isEditModalOpen = useHostsStoreEditModalIsOpen()

    useEffect(() => {
        if (isCreateModalOpen || isEditModalOpen) return
        ;(async () => {
            await queryClient.refetchQueries({ queryKey: QueryKeys.hosts.getAllHosts.queryKey })
        })()
    }, [isCreateModalOpen, isEditModalOpen])

    return <HostsPageComponent hosts={hosts} inbounds={inbounds} isHostsLoading={isHostsLoading} />
}
