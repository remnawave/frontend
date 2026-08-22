import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Drawer } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetInternalSquadAccessibleNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { AccessibleNodesTree } from './accessible-nodes.tree'

interface IProps {
    uuid: string
}

export const InternalSquadAccessibleNodesDrawer = NiceModal.create((props: IProps) => {
    const { uuid } = props
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal, drawer: true })

    const { t } = useTranslation()

    const { data: internalSquadAccessibleNodes, isLoading } = useGetInternalSquadAccessibleNodes({
        route: {
            uuid
        }
    })

    const accessibleNodes = internalSquadAccessibleNodes?.accessibleNodes ?? []

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
                    title={t(
                        'internal-squad-accessible-nodes.modal.widget.internal-squad-accessible-nodes'
                    )}
                />
            }
        >
            {isLoading && <LoadingScreen />}
            {!isLoading && accessibleNodes.length === 0 && (
                <EmptyPageLayout icon={<TbServer size="32" />} />
            )}
            {!isLoading && accessibleNodes.length > 0 && (
                <AccessibleNodesTree accessibleNodes={accessibleNodes} />
            )}
        </Drawer>
    )
})
