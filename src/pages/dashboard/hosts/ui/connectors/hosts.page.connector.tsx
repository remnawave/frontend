import { useEffect } from 'react'

import {
    useHostsStoreCreateModalIsOpen,
    useHostsStoreEditModalIsOpen
} from '@entities/dashboard/hosts/hosts-store'
import { QueryKeys, useGetConfigProfiles, useGetHosts, useGetHostTags } from '@shared/api/hooks'
import HostsPageComponent from '@pages/dashboard/hosts/ui/components/hosts.page.component'
import { queryClient } from '@shared/api'

export function HostsPageConnector() {
    const { data: hosts, isLoading: isHostsLoading } = useGetHosts()
    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()
    const { data: hostTags, isLoading: isHostTagsLoading } = useGetHostTags()

    const isCreateModalOpen = useHostsStoreCreateModalIsOpen()
    const isEditModalOpen = useHostsStoreEditModalIsOpen()

    useEffect(() => {
        if (isCreateModalOpen || isEditModalOpen) return
        ;(async () => {
            await queryClient.refetchQueries({ queryKey: QueryKeys.hosts.getAllHosts.queryKey })
        })()
    }, [isCreateModalOpen, isEditModalOpen])

    return (
        <HostsPageComponent
            configProfiles={configProfiles?.configProfiles}
            hosts={hosts}
            hostTags={hostTags?.tags}
            isConfigProfilesLoading={isConfigProfilesLoading}
            isHostsLoading={isHostsLoading}
            isHostTagsLoading={isHostTagsLoading}
        />
    )
}
