import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useListState } from '@mantine/hooks'
import { Container } from '@mantine/core'
import { useEffect, useRef } from 'react'

import { HostCardWidget } from '@widgets/dashboard/hosts/host-card'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { useReorderHosts } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function HostsTableWidget(props: IProps) {
    const { inbounds, hosts, selectedHosts, setSelectedHosts } = props

    const [state, handlers] = useListState(hosts || [])
    const prevStateRef = useRef(state)

    const { mutate: reorderHosts } = useReorderHosts()

    useEffect(() => {
        ;(async () => {
            if (!state || state.length === 0) {
                return
            }

            const updatedHosts = state.map((host, index) => ({
                uuid: host.uuid,
                viewPosition: index
            }))

            const hasOrderChanged = prevStateRef.current?.some(
                (host, index) => host.uuid !== state[index].uuid
            )

            if (hasOrderChanged) {
                reorderHosts({
                    variables: { hosts: updatedHosts }
                })
            }

            prevStateRef.current = state
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(hosts || [])
        prevStateRef.current = hosts || []
    }, [hosts])

    if (!hosts || !inbounds) {
        return null
    }

    if (hosts.length === 0) {
        return <EmptyPageLayout />
    }

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source } = result
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
    }

    const toggleHostSelection = (hostId: string) => {
        setSelectedHosts((prev) =>
            prev.includes(hostId) ? prev.filter((id) => id !== hostId) : [...prev, hostId]
        )
    }

    if (!hosts || !inbounds) return null
    if (hosts.length === 0) return <EmptyPageLayout />

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable direction="vertical" droppableId="dnd-list">
                {(provided) => (
                    <Container
                        p={0}
                        size={'lg'}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {state.map((item, index) => (
                            <div key={item.uuid} style={{ position: 'relative' }}>
                                <HostCardWidget
                                    inbounds={inbounds}
                                    index={index}
                                    isSelected={selectedHosts.includes(item.uuid)}
                                    item={item}
                                    onSelect={() => toggleHostSelection(item.uuid)}
                                />
                            </div>
                        ))}
                        {provided.placeholder}
                    </Container>
                )}
            </Droppable>
        </DragDropContext>
    )
}
