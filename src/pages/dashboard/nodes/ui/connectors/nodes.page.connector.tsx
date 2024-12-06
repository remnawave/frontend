import { useInterval } from '@mantine/hooks'
import { useEffect } from 'react'

import { useNodesStoreActions, useNodesStoreNodes } from '@entities/dashboard/nodes/nodes-store'

import NodesPageComponent from '../components/nodes.page.component'

export function NodesPageConnector() {
    const actions = useNodesStoreActions()

    const nodes = useNodesStoreNodes()

    useEffect(() => {
        ;(async () => {
            await actions.getNodes()
            await actions.getPubKey()
        })()
        return () => {
            actions.resetState()
        }
    }, [])

    useInterval(
        () => {
            actions.getNodes()
        },
        3000,
        { autoInvoke: true }
    )

    return <NodesPageComponent nodes={nodes} />
}
