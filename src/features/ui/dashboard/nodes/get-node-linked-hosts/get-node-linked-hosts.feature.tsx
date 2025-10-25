import { useTranslation } from 'react-i18next'
import { TbServerCog } from 'react-icons/tb'
import { Menu } from '@mantine/core'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

const GetNodeLinkedHostsFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Menu.Item
            leftSection={<TbServerCog size="16px" />}
            onClick={() => {
                openModalWithData(MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER, {
                    nodeUuid
                })
            }}
        >
            {t('get-node-linked-hosts.feature.linked-hosts')}
        </Menu.Item>
    )
}

export const GetNodeLinkedHostsFeature = memo(GetNodeLinkedHostsFeatureComponent)
