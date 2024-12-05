import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import cuid2, { createId } from '@paralleldrive/cuid2'
import { useListState } from '@mantine/hooks'
import { useEffect } from 'react'

import { HostCardWidget } from '@/widgets/dashboard/hosts/host-card'
import { useHostsStoreActions } from '@/entitites/dashboard'

import { IProps } from './interfaces'

export function HostsTableWidget(props: IProps) {
    const { hosts, inbounds } = props

    const actions = useHostsStoreActions()
    const [state, handlers] = useListState(hosts || [])

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source } = result
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
    }

    useEffect(() => {
        ;(async () => {
            if (!hosts || !state) {
                return
            }

            const updatedHosts = hosts.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))

            // Проверяем, изменился ли порядок
            const hasOrderChanged = hosts?.some((host, index) => host.uuid !== state[index].uuid)

            if (hasOrderChanged) {
                await actions.reorderHosts(updatedHosts)
            }
        })()
    }, [state])

    if (!hosts || !inbounds) {
        return null
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable direction="vertical" droppableId="dnd-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {state.map((item, index) => (
                            <HostCardWidget index={index} item={item} key={item.uuid} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
