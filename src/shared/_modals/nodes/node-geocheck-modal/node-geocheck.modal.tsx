import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal } from '@mantine/core'
import { GetNodeCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbMapSearch } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { GeocheckFailedWidget } from './geocheck-failed.widget'
import { GeocheckFormWidget } from './geocheck-form.widget'
import { GeocheckProgressWidget } from './geocheck-progress.widget'
import { GeocheckResultWidget } from './geocheck-result.widget'
import { useNodeGeocheck } from './use-node-geocheck'

interface IProps {
    node: GetNodeCommand.Response['response']
}

export const NodeGeocheckModal = NiceModal.create((props: IProps) => {
    const { node } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { isCompleted, isFailed, isRunning, reset, result, start } = useNodeGeocheck(node.uuid)

    const hasReport = isRunning && isCompleted && !isFailed && !!result?.success

    const renderContent = () => {
        if (!isRunning) {
            return <GeocheckFormWidget node={node} onCancel={hide} onStart={start} />
        }

        if (isFailed || (isCompleted && !result?.success)) {
            return <GeocheckFailedWidget message={result?.message ?? null} onRestart={reset} />
        }

        if (hasReport && result) {
            return <GeocheckResultWidget onRestart={reset} result={result} />
        }

        return <GeocheckProgressWidget />
    }

    return (
        <Modal
            {...modalProps}
            removeScrollProps={{ allowPinchZoom: true }}
            size={hasReport ? 'min(1000px, 95vw)' : 'min(520px, 95vw)'}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbMapSearch}
                    iconVariant="soft"
                    subtitle={node.name}
                    title={t('node-geocheck.title')}
                />
            }
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            {renderContent()}
        </Modal>
    )
})
