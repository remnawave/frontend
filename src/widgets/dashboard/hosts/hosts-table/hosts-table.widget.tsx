import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useListState } from '@mantine/hooks'
import { useEffect } from 'react'

import { HostCardWidget } from '@widgets/dashboard/hosts/host-card'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { useReorderHosts } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function HostsTableWidget(props: IProps) {
    const { inbounds, hosts } = props

    const [state, handlers] = useListState(hosts || [])
    const { mutate: reorderHosts } = useReorderHosts()

    useEffect(() => {
        ;(async () => {
            if (!hosts || !state) {
                return
            }

            const updatedHosts = hosts.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))

            const hasOrderChanged = hosts?.some((host, index) => host.uuid !== state[index].uuid)

            if (hasOrderChanged) {
                reorderHosts({ variables: { hosts: updatedHosts } })
            }
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(hosts || [])
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

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable direction="vertical" droppableId="dnd-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {state.map((item, index) => (
                            <HostCardWidget
                                inbounds={inbounds}
                                index={index}
                                item={item}
                                key={item.uuid}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
