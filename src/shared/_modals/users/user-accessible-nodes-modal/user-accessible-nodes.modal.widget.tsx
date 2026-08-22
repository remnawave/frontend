import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Drawer } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetUserAccessibleNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { UserAccessibleNodesTree } from './user-accessible-nodes.tree'

interface IProps {
    userId: number
}

export const UserAccessibleNodesModal = NiceModal.create((props: IProps) => {
    const { userId } = props
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal, drawer: true })

    const { t } = useTranslation()

    const { data: userAccessibleNodes, isLoading } = useGetUserAccessibleNodes({
        route: {
            userId
        }
    })

    const activeNodes = userAccessibleNodes?.activeNodes ?? []

    return (
        <Drawer
            {...modalProps}
            position="right"
            size="800px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbServer}
                    iconVariant="soft"
                    title={t('user-accessible-nodes.modal.widget.user-accessible-nodes')}
                />
            }
        >
            {isLoading && <LoadingScreen />}
            {!isLoading && activeNodes.length === 0 && (
                <EmptyPageLayout icon={<TbServer size="32" />} />
            )}
            {!isLoading && activeNodes.length > 0 && (
                <UserAccessibleNodesTree activeNodes={activeNodes} />
            )}
        </Drawer>
    )
})
