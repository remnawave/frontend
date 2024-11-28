import { useEffect } from 'react'

import { Badge, Button, Group, Text } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { PiArrowsClockwise, PiDotsSixVertical, PiHandDuotone, PiPlus } from 'react-icons/pi'
import { useHostsStoreActions } from '@/entitites/dashboard'
import { DataTable } from '@/shared/ui/stuff/data-table'
import { HostCardWidget } from '@/widgets/dashboard/hosts/host-card'
import { IProps } from './interfaces'

export function HostsTableWidget(props: IProps) {
    const { hosts, inbounds } = props

    const actions = useHostsStoreActions()
    const [state, handlers] = useListState(hosts)

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination } = result
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
    }

    useEffect(() => {
        ;(async () => {
            console.log('State updated:', state)
            const updatedHosts = hosts.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))
            console.log(updatedHosts)
            const res = await actions.reorderHosts(updatedHosts)
            console.log(res)
        })()
    }, [state])

    return (
        <>
            <DataTable.Container mb="xl">
                <DataTable.Title
                    title="Users"
                    description="List of all users"
                    actions={
                        <>
                            <Group>
                                <Button
                                    variant="default"
                                    size="xs"
                                    leftSection={<PiArrowsClockwise size="1rem" />}
                                >
                                    Update
                                </Button>

                                <Button
                                    variant="default"
                                    size="xs"
                                    leftSection={<PiPlus size="1rem" />}
                                >
                                    Create new user
                                </Button>
                            </Group>
                        </>
                    }
                />
            </DataTable.Container>

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
        </>
    )
}
