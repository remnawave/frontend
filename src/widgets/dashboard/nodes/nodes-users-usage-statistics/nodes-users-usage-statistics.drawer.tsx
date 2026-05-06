import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { TbChartArcs3 } from 'react-icons/tb'
import { em, Modal } from '@mantine/core'

import { MODALS, useModalCloseActions, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { NodesUsersUsageStatisticsContent } from './nodes-users-usage-statistics.content'

export const NodesUsersUsageStatisticsDrawer = () => {
    const { isOpen, internalState } = useModalState(MODALS.NODES_USERS_USAGE_STATISTICS_MODAL)
    const [handleClose, clearInternalState] = useModalCloseActions(
        MODALS.NODES_USERS_USAGE_STATISTICS_MODAL
    )
    const { t } = useTranslation()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    return (
        <Modal
            centered
            fullScreen={isMobile}
            onClose={handleClose}
            onExitTransitionEnd={clearInternalState}
            opened={isOpen}
            size="800px"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbChartArcs3}
                    iconVariant="soft"
                    title={t('node-users-usage-drawer.widget.user-traffic-statistics')}
                />
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {internalState && internalState.nodeUuids.length > 0 && (
                <NodesUsersUsageStatisticsContent nodeUuids={internalState.nodeUuids} />
            )}
        </Modal>
    )
}
