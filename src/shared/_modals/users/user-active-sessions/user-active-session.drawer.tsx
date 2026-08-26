import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Drawer } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbRadar } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { FailedStateWidget } from './failed-state.widget'
import { ProgressWidget } from './progress.widget'
import { ResultsWidget } from './results.widget'
import { useUserActiveSessions } from './use-user-active-sessions'

interface IProps {
    userId: number
}

export const UserActiveSessionDrawer = NiceModal.create((props: IProps) => {
    const { userId } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { dropAll, dropIp, dropNode, isCompleted, isFailed, nodes, progress, refresh } =
        useUserActiveSessions(userId)

    const renderContent = () => {
        if (isFailed) return <FailedStateWidget onDropAll={dropAll} onRefresh={refresh} />
        if (isCompleted) {
            return (
                <ResultsWidget
                    nodes={nodes ?? []}
                    onDropAll={dropAll}
                    onDropIp={dropIp}
                    onDropNode={dropNode}
                    onRefresh={refresh}
                />
            )
        }
        return (
            <ProgressWidget
                completed={progress?.completed ?? 0}
                percent={progress?.percent ?? 0}
                total={progress?.total ?? 0}
            />
        )
    }

    return (
        <Drawer
            {...modalProps}
            position="right"
            size="500px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbRadar}
                    iconVariant="soft"
                    title={t('common.field.active-sessions')}
                />
            }
        >
            {renderContent()}
        </Drawer>
    )
})
