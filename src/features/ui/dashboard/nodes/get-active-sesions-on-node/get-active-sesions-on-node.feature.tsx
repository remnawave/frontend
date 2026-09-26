import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbRadar } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'

interface IProps {
    nodeUuid: string
}

export function GetActiveSessionsOnNodeFeature(props: IProps) {
    const { nodeUuid } = props

    const { t } = useTranslation()

    return (
        <Tooltip label={t('common.field.active-sessions')}>
            <ActionIcon
                color="indigo"
                onClick={() => showModal('nodes_nodeActiveSessionsDrawer', { nodeUuid })}
                size="lg"
                variant="soft"
            >
                <TbRadar size="22px" />
            </ActionIcon>
        </Tooltip>
    )
}
