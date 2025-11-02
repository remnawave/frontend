import { ActionIcon, Tooltip } from '@mantine/core'
import { TbQuestionMark } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'

import { THelpDrawerAvailableScreen } from './help-drawer.types'

interface IProps {
    hidden?: boolean
    screen: THelpDrawerAvailableScreen
}

export const HelpActionIconShared = memo((props: IProps) => {
    const { hidden, screen } = props

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
            >
                <TbQuestionMark size={24} />
            </ActionIcon>
        </Tooltip>
    )
})
