import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServerCog } from 'react-icons/tb'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { IProps } from './interfaces'

const GetNodeLinkedHostsFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    return (
        <Tooltip label={t('get-node-linked-hosts.feature.linked-hosts')}>
            <ActionIcon
                color="cyan"
                onClick={() => {
                    openModalWithData(MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER, {
                        nodeUuid
                    })
                }}
                size="lg"
                variant="soft"
            >
                <TbServerCog size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}

export const GetNodeLinkedHostsFeature = memo(GetNodeLinkedHostsFeatureComponent)
