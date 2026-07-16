import { ActionIcon, Tooltip } from '@mantine/core'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbSitemap } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'

interface IProps {
    nodeUuid: string
}

const GetNodeInboundsHostsFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    return (
        <Tooltip label={t('get-node-inbounds-hosts.feature.inbounds-and-hosts')}>
            <ActionIcon
                color="teal"
                onClick={() => {
                    showModal('nodes_nodeInboundsHostsDrawer', {
                        nodeUuid
                    })
                }}
                size="lg"
                variant="soft"
            >
                <TbSitemap size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}

export const GetNodeInboundsHostsFeature = memo(GetNodeInboundsHostsFeatureComponent)
