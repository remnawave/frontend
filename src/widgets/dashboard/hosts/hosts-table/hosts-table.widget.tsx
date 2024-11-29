import { useEffect } from 'react'

import { useListState } from '@mantine/hooks'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useHostsStoreActions, useHostsStoreIsHostsLoading } from '@/entitites/dashboard'
import { LoadingScreen } from '@/shared/ui/loading-screen'
import { HostCardWidget } from '@/widgets/dashboard/hosts/host-card'
import { HostsPageHeaderWidget } from '../hosts-page-header'
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

            await actions.reorderHosts(updatedHosts)
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
