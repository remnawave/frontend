import { useEffect } from 'react'

import {
    nodesQueryKeys,
    QueryKeys,
    useGetConfigProfiles,
    useGetNodes,
    useGetNodesTags
} from '@shared/api/hooks'
import {
    useNodesStoreActions,
    useNodesStoreCreateModalIsOpen
} from '@entities/dashboard/nodes/nodes-store'
import { queryClient } from '@shared/api'

import NodesPageComponent from '../components/nodes.page.component'

export function NodesPageConnector() {
    const actions = useNodesStoreActions()

    const isCreateModalOpen = useNodesStoreCreateModalIsOpen()

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
        if (isCreateModalOpen) return
        ;(async () => {
            await queryClient.refetchQueries({ queryKey: QueryKeys.nodes.getAllNodes.queryKey })
        })()
    }, [isCreateModalOpen])

    return <NodesPageComponent isLoading={isLoading || isConfigProfilesLoading} nodes={nodes} />
}
