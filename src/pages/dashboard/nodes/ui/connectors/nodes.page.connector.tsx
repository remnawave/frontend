import { useEffect } from 'react'

import {
    useNodesStoreActions,
    useNodesStoreCreateModalIsOpen,
    useNodesStoreEditModalIsOpen
} from '@entities/dashboard/nodes/nodes-store'
import {
    nodesQueryKeys,
    QueryKeys,
    useGetConfigProfiles,
    useGetNodes,
    useGetNodesTags
} from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import NodesPageComponent from '../components/nodes.page.component'

export function NodesPageConnector() {
    const actions = useNodesStoreActions()

    const isCreateModalOpen = useNodesStoreCreateModalIsOpen()
    const isEditModalOpen = useNodesStoreEditModalIsOpen()

    const { data: nodes, isLoading } = useGetNodes()
    const { isLoading: isConfigProfilesLoading } = useGetConfigProfiles()
    useGetNodesTags()

    useEffect(() => {
        ;(async () => {
            await queryClient.prefetchQuery({
                queryKey: nodesQueryKeys.getPubKey.queryKey
            })
        })()
        return () => {
            actions.resetState()
        }
    }, [])

    useEffect(() => {
        if (isCreateModalOpen || isEditModalOpen) return
        ;(async () => {
            await queryClient.refetchQueries({ queryKey: QueryKeys.nodes.getAllNodes.queryKey })
        })()
    }, [isCreateModalOpen, isEditModalOpen])

    return <NodesPageComponent isLoading={isLoading || isConfigProfilesLoading} nodes={nodes} />
}
