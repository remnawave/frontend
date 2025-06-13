import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { memo, useCallback, useEffect, useState } from 'react'
import { useListState } from '@mantine/hooks'
import { Container } from '@mantine/core'

import { nodesQueryKeys, useGetNodes, useReorderNodes } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { sToMs } from '@shared/utils/time-utils'
import { queryClient } from '@shared/api'

import { NodeCardWidget } from '../node-card'
import { IProps } from './interfaces'

export const NodesTableWidget = memo((props: IProps) => {
    const { nodes } = props
    const [state, handlers] = useListState(nodes || [])
    const [isPollingEnabled, setIsPollingEnabled] = useState(true)

    useGetNodes({
        rQueryParams: {
            enabled: isPollingEnabled,
            refetchInterval: isPollingEnabled ? sToMs(5) : false
        }
    })

    const { mutate: reorderNodes } = useReorderNodes({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(nodesQueryKeys.getAllNodes.queryKey, data)
            },
            onError: () => {
                queryClient.invalidateQueries({ queryKey: nodesQueryKeys.getAllNodes.queryKey })
            }
        }
    })

    useEffect(() => {
        ;(async () => {
            if (!nodes || !state) {
                return
            }

            const nodesToReorder = nodes

            const updatedNodes = nodesToReorder.map((node) => ({
                uuid: node.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === node.uuid)
            }))

            const hasOrderChanged = nodesToReorder?.some(
                (node, index) => node.uuid !== state[index].uuid
            )

            if (hasOrderChanged) {
                reorderNodes({ variables: { nodes: updatedNodes } })
            }
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(nodes || [])
    }, [nodes])

    const handleDragEnd = useCallback(
        async (result: DropResult) => {
            const { destination, source } = result
            if (!destination) return

            handlers.reorder({ from: source.index, to: destination.index })
            setIsPollingEnabled(true)
        },
        [handlers]
    )

    const handleDragStart = useCallback(() => {
        setIsPollingEnabled(false)
    }, [])

    if (!nodes) {
        return null
    }

    if (nodes.length === 0) {
        return <EmptyPageLayout />
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <Droppable direction="vertical" droppableId="dnd-list">
                {(provided) => (
                    <Container
                        p={0}
                        size={'lg'}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ minHeight: '100px' }}
                    >
                        {state.map((item, index) => (
                            <NodeCardWidget index={index} key={item.uuid} node={item} />
                        ))}
                        {provided.placeholder}
                    </Container>
                )}
            </Droppable>
        </DragDropContext>
    )
})
