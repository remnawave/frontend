import { useTranslation } from 'react-i18next'
import { Loader, Menu } from '@mantine/core'
import { TbRefresh } from 'react-icons/tb'

import { useResetNodeTraffic } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function ResetNodeTrafficFeature(props: IProps) {
    const { t } = useTranslation()
    const { handleClose, node } = props

    const { mutate: resetNodeTraffic, isPending } = useResetNodeTraffic({
        route: {
            uuid: node.uuid
        },
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    })

    return (
        <Menu.Item
            leftSection={
                isPending ? <Loader color="teal" size="1rem" /> : <TbRefresh size="1rem" />
            }
            onClick={() => resetNodeTraffic({})}
        >
            {t('reset-node-traffic.feature.reset-traffic')}
        </Menu.Item>
    )
}
