import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useListState } from '@mantine/hooks'

import { HostCardWidget } from '@widgets/dashboard/hosts/host-card'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { useReorderHosts } from '@shared/api/hooks'

import { IProps } from './interfaces'

const MemoizedHostCard = memo(HostCardWidget)

export function HostsTableWidget(props: IProps) {
    const { inbounds, hosts, selectedHosts, setSelectedHosts } = props
    const [state, handlers] = useListState(hosts || [])

    const { mutate: reorderHosts } = useReorderHosts()

    const checkOrderAndReorder = useCallback(() => {
        if (!hosts || !state) return

        const hasOrderChanged = hosts.some((host, index) => state[index]?.uuid !== host.uuid)

        if (hasOrderChanged) {
            const updatedHosts = hosts.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))

            reorderHosts({ variables: { hosts: updatedHosts } })
        }
    }, [hosts, state, reorderHosts])

    useEffect(() => {
        checkOrderAndReorder()
    }, [checkOrderAndReorder])

    useEffect(() => {
        handlers.setState(hosts || [])
    }, [hosts])

    const toggleHostSelection = useCallback(
        (hostId: string) => {
            setSelectedHosts((prev) =>
                prev.includes(hostId) ? prev.filter((id) => id !== hostId) : [...prev, hostId]
            )
        },
        [setSelectedHosts]
    )

    const handleDragEnd = useCallback(
        async (result: DropResult) => {
            const { destination, source } = result
            handlers.reorder({ from: source.index, to: destination?.index || 0 })
        },
        [handlers]
    )

    const selectedHostsMap = useMemo(() => {
        const map = new Set(selectedHosts)
        return map
    }, [selectedHosts])

    if (!hosts || !inbounds) return null
    if (hosts.length === 0) return <EmptyPageLayout />

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable direction="vertical" droppableId="dnd-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {state.map((item, index) => (
                            <div key={item.uuid} style={{ position: 'relative' }}>
                                <MemoizedHostCard
                                    inbounds={inbounds}
                                    index={index}
                                    isSelected={selectedHostsMap.has(item.uuid)}
                                    item={item}
                                    onSelect={() => toggleHostSelection(item.uuid)}
                                />
                            </div>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
