import { Drawer, ScrollArea, Typography } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'

import { HELP_DRAWER_AVAILABLE_SCREENS } from './help-drawer.types'
import { LoaderModalShared } from '../loader-modal'

export const HelpDrawerShared = memo(() => {
    const { isOpen, internalState } = useModalState(MODALS.HELP_DRAWER)
    const close = useModalClose(MODALS.HELP_DRAWER)

    const { t } = useTranslation()

    let content = null

    switch (internalState?.screen) {
        case HELP_DRAWER_AVAILABLE_SCREENS.EXTERNAL_SQUADS_GRID:
            content = t('help-drawer.shared.external-squads-grid')
            break
        case HELP_DRAWER_AVAILABLE_SCREENS.INTERNAL_SQUADS_GRID:
            content = t('help-drawer.shared.internal-squads-grid')
            break
        case HELP_DRAWER_AVAILABLE_SCREENS.TEMPLATES_JSON:
            content = t('help-drawer.shared.templates-xray-json')
            break
        default:
            content = t('help-drawer.shared.unknown-screen-provided')
            break
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={close}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            position="right"
            size="lg"
            title={t('help-action-icon.shared.help-article')}
        >
            <ScrollArea h="100%">
                {!internalState && (
                    <LoaderModalShared text={t('help-drawer.shared.loading-help-drawer')} />
                )}
                {internalState && (
                    <Typography pb="xl">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: content
                            }}
                        />
                    </Typography>
                )}
            </ScrollArea>
        </Drawer>
    )
})
