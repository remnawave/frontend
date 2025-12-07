import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core'
import { TbQuestionMark } from 'react-icons/tb'
import { IconBaseProps } from 'react-icons/lib'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { THelpDrawerAvailableScreen } from './help-drawer.types'

interface IProps {
    actionIconProps?: Omit<ActionIconProps, 'onClick'>
    hidden?: boolean
    iconProps?: IconBaseProps
    screen: THelpDrawerAvailableScreen
}

export const HelpActionIconShared = memo((props: IProps) => {
    const { actionIconProps, hidden, iconProps, screen } = props

    const { t } = useTranslation()

    const openWithData = useModalsStoreOpenWithData()

    const handleOpenHelpDrawer = () => {
        if (hidden) {
            return
        }

        openWithData(MODALS.HELP_DRAWER, {
            screen
        })
    }

    return (
        <Tooltip label={t('help-action-icon.shared.help-article')}>
            <ActionIcon
                color="lime"
                hidden={hidden}
                onClick={handleOpenHelpDrawer}
                size="input-md"
                variant="light"
                {...actionIconProps}
            >
                <TbQuestionMark size={24} {...iconProps} />
            </ActionIcon>
        </Tooltip>
    )
})
