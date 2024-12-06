import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useListState } from '@mantine/hooks'
import { useEffect } from 'react'

import { HostCardWidget } from '@widgets/dashboard/hosts/host-card'
import { useHostsStoreActions } from '@entities/dashboard'
import { useReorderHosts } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function HostsTableWidget(props: IProps) {
    const { hosts, inbounds } = props

    const [state, handlers] = useListState(hosts || [])

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source } = result
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
    }

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

            // Проверяем, изменился ли порядок
            const hasOrderChanged = hosts?.some((host, index) => host.uuid !== state[index].uuid)

            if (hasOrderChanged) {
                reorderHosts({ variables: { hosts: updatedHosts } })
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
