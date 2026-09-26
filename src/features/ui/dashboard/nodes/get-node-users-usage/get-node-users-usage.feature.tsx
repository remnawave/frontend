import { ActionIcon, Tooltip } from '@mantine/core'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbChartArcs } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'

import { IProps } from './interfaces'

const GetNodeUsersUsageFeatureComponent = (props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    return (
        <Tooltip label={t('common.field.usage-stats')}>
            <ActionIcon
                color="indigo"
                onClick={() => {
                    showModal('nodes_nodeUsageStatsDrawer', {
                        nodeUuid
                    })
                }}
                size="lg"
                variant="soft"
            >
                <TbChartArcs size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}

export const GetNodeUsersUsageFeature = memo(GetNodeUsersUsageFeatureComponent)
