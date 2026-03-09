import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { TbRadar } from 'react-icons/tb'
import { Menu } from '@mantine/core'

import { NodeActiveSessionsDrawerWidget } from '@widgets/dashboard/nodes/node-active-sessions'

interface IProps {
    nodeUuid: string
}

export function GetActiveSessionsOnNodeFeature(props: IProps) {
    const { nodeUuid } = props
    const [activeSessionsModalOpened, activeSessionsModalHandlers] = useDisclosure(false)
    const { t } = useTranslation()

    return (
        <>
            <Menu.Item
                leftSection={<TbRadar size="16px" />}
                onClick={activeSessionsModalHandlers.open}
            >
                {t('get-user-usage.feature.active-sessions')}
            </Menu.Item>

            <NodeActiveSessionsDrawerWidget
                nodeUuid={nodeUuid}
                onClose={activeSessionsModalHandlers.close}
                opened={activeSessionsModalOpened}
            />
        </>
    )
}
