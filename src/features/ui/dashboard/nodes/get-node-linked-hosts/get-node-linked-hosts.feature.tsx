import { useTranslation } from 'react-i18next'
import { TbServerCog } from 'react-icons/tb'
import { Menu } from '@mantine/core'
import { memo } from 'react'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

const GetNodeLinkedHostsFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const { open: openModal, setInternalData } = useModalsStore()

    return (
        <Menu.Item
            leftSection={<TbServerCog size="16px" />}
            onClick={() => {
                setInternalData({
                    internalState: {
                        nodeUuid
                    },
                    modalKey: MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER
                })
                openModal(MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER)
            }}
        >
            {t('get-node-linked-hosts.feature.linked-hosts')}
        </Menu.Item>
    )
}

export const GetNodeLinkedHostsFeature = memo(GetNodeLinkedHostsFeatureComponent)
