import { useTranslation } from 'react-i18next'
import { Loader, Menu } from '@mantine/core'
import { TbTrash } from 'react-icons/tb'

import { useDeleteNode } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function DeleteNodeFeature(props: IProps) {
    const { t } = useTranslation()
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
        <Menu.Item
            color="red.5"
            leftSection={isPending ? <Loader color="red" size={14} /> : <TbTrash size={14} />}
            onClick={handleDeleteNode}
        >
            {t('delete-node.feature.delete-node')}
        </Menu.Item>
    )
}
