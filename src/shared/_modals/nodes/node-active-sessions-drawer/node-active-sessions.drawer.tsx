import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Box, Drawer, Transition } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbRadar } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { FailedStateWidget } from './failed-state.widget'
import { ProgressWidget } from './progress.widget'
import { ResultsWidget } from './results.widget'
import { useNodeActiveSessions } from './use-node-active-sessions'

interface IProps {
    nodeUuid: string
}

export const NodeActiveSessionsDrawer = NiceModal.create((props: IProps) => {
    const { nodeUuid } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { isCompleted, isFailed, refresh, users } = useNodeActiveSessions(nodeUuid)

    const renderContent = () => {
        if (isFailed) return <FailedStateWidget onRefresh={refresh} />
        if (isCompleted) return <ResultsWidget onRefresh={refresh} users={users ?? []} />
        return <ProgressWidget />
    }

    return (
        <Drawer
            {...modalProps}
            position="right"
            size="500px"
            styles={{
                body: {
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbRadar}
                    iconVariant="soft"
                    title={t('common.field.active-sessions')}
                />
            }
        >
            <Transition
                duration={300}
                mounted={true}
                timingFunction="ease-in-out"
                transition="fade"
            >
                {(styles) => (
                    <Box
                        style={{
                            ...styles,
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {renderContent()}
                    </Box>
                )}
            </Transition>
        </Drawer>
    )
})
