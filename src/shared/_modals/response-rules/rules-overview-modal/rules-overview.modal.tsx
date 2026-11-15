import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '@mantine/core'
import { TbSitemap } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { RulesOverviewFlow } from '../flow/rules-overview-flow'

interface IProps {
    rules: unknown[]
}

export const RulesOverviewModal = NiceModal.create(({ rules }: IProps) => {
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    return (
        <Modal
            {...modalProps}
            size="90%"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbSitemap}
                    iconVariant="soft"
                    title="All rules"
                />
            }
        >
            <RulesOverviewFlow rules={rules} />
        </Modal>
    )
})
