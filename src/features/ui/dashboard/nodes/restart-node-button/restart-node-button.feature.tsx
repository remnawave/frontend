import { useTranslation } from 'react-i18next'
import { Loader, Menu } from '@mantine/core'
import { TbReload } from 'react-icons/tb'

import { useRestartNode } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function RestartNodeButtonFeature(props: IProps) {
    const { t } = useTranslation()

    const { handleClose, node } = props

    const mutationParams = {
        route: {
            uuid: node.uuid
        },
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    }

    const { mutate: restartNode, isPending: isRestartNodePending } = useRestartNode(mutationParams)

    if (!node) return null

    return (
        <Menu.Item
            color="teal"
            disabled={node.isDisabled}
            leftSection={
                isRestartNodePending ? (
                    <Loader color="teal" size="1rem" />
                ) : (
                    <TbReload size="1rem" />
                )
            }
            onClick={() => restartNode({})}
        >
            {t('restart-node-button.feature.restart')}
        </Menu.Item>
    )
}
