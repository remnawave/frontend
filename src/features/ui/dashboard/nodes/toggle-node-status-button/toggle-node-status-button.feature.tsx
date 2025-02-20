import { PiCellSignalFullDuotone, PiCellSignalSlashDuotone, PiTrashDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Button } from '@mantine/core'

import { useDisableNode, useEnableNode } from '@shared/api/hooks'

import { IProps } from './interfaces'

export function ToggleNodeStatusButtonFeature(props: IProps) {
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

    const { mutate: disableNode, isPending: isDisableNodePending } = useDisableNode(mutationParams)
    const { mutate: enableNode, isPending: isEnableNodePending } = useEnableNode(mutationParams)

    if (!node) return null

    let buttonLabel = ''
    let color = 'blue'
    let icon = <PiTrashDuotone size="1rem" />

    if (node.isDisabled) {
        color = 'green'
        buttonLabel = t('toggle-node-status-button.feature.enable')
        icon = <PiCellSignalFullDuotone size="1rem" />
    } else {
        color = 'red'
        buttonLabel = t('toggle-node-status-button.feature.disable')
        icon = <PiCellSignalSlashDuotone size="1rem" />
    }

    const handleToggleUserStatus = async () => {
        if (node.isDisabled) {
            enableNode({})
        } else {
            disableNode({})
        }
    }

    return (
        <Button
            color={color}
            leftSection={icon}
            loading={isDisableNodePending || isEnableNodePending}
            onClick={handleToggleUserStatus}
            size="md"
            type="button"
        >
            {buttonLabel}
        </Button>
    )
}
