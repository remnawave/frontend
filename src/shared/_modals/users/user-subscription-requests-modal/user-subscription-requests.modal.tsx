import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbTimeline } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useIsMobile } from '@shared/hooks/use-is-mobile'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { UserSubscriptionRequestsModalContent } from './user-subscription-requests.content.widget'

interface IProps {
    userId: number
}

export const UserSubscriptionRequestsModal = NiceModal.create((props: IProps) => {
    const { userId } = props
    const { t } = useTranslation()
    const isMobile = useIsMobile()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal
    })

    return (
        <Modal
            {...modalProps}
            size="min(1000px, 70vw)"
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
                    IconComponent={TbTimeline}
                    iconVariant="soft"
                    title={t(
                        'common.field.subscription-request-history'
                    )}
                />
            }
        >
            <UserSubscriptionRequestsModalContent userId={userId} mobile={isMobile} />
        </Modal>
    )
})
