import { Loader, Menu } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
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

    const openModal = () =>
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            centered: true,
            cancelProps: {
                variant: 'subtle'
            },
            confirmProps: { color: 'red', variant: 'soft' },
            onConfirm: () => deleteNode({})
        })

    return (
        <Menu.Item
            color="red"
            leftSection={isPending ? <Loader color="red" size="1rem" /> : <TbTrash size="1rem" />}
            onClick={openModal}
        >
            {t('common.action.delete')}
        </Menu.Item>
    )
}
