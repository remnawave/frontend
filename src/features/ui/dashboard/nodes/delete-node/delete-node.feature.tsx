import { ActionIcon, Tooltip } from '@mantine/core'
import { PiTrashDuotone } from 'react-icons/pi'

import { useDeleteNode } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function DeleteNodeFeature(props: IProps) {
    const { handleClose, node } = props

    const { mutate: deleteNode, isPending } = useDeleteNode({
        route: {
            uuid: node.uuid
        },
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    })

    const handleDeleteNode = async () => {
        deleteNode({})
    }

    return (
        <Tooltip label="Delete node">
            <ActionIcon color="red" loading={isPending} onClick={handleDeleteNode} size="xl">
                <PiTrashDuotone size="1.5rem" />
            </ActionIcon>
        </Tooltip>
    )
}
