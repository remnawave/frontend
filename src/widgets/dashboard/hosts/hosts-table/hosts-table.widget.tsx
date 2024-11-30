import { useEffect } from 'react'

import { useListState } from '@mantine/hooks'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useHostsStoreActions } from '@/entitites/dashboard'
import { HostCardWidget } from '@/widgets/dashboard/hosts/host-card'
import { IProps } from './interfaces'

export function HostsTableWidget(props: IProps) {
    const { hosts, inbounds } = props

    if (!hosts || !inbounds) {
        return null
    }

    const actions = useHostsStoreActions()
    const [state, handlers] = useListState(hosts)

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination } = result
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
    }

    useEffect(() => {
        ;(async () => {
            const updatedHosts = hosts.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))

            // Проверяем, изменился ли порядок
            const hasOrderChanged = hosts.some((host, index) => host.uuid !== state[index].uuid)

            if (hasOrderChanged) {
                await actions.reorderHosts(updatedHosts)
            }
        })()
    }, [state])

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {state.map((item, index) => (
                            <HostCardWidget item={item} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
