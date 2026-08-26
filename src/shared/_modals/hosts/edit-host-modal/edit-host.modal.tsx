import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Drawer } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiListChecks } from 'react-icons/pi'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetHost } from '@shared/api/hooks'
import { OPEN_ENTITY } from '@shared/constants'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { EditHostDrawerContent } from './edit-host.modal.content'

interface IProps {
    hostUuid: string
}

export const EditHostDrawer = NiceModal.create((props: IProps) => {
    const { hostUuid } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({
        modal,
        drawer: true,
        onClose() {
            queryClient.refetchQueries({
                queryKey: QueryKeys.hosts.getAllTags.queryKey
            })
            queryClient.refetchQueries({
                queryKey: QueryKeys.hosts.getAllHosts.queryKey
            })
        }
    })

    const { data: host, isLoading: isGetHostLoading } = useGetHost({ route: { uuid: hostUuid } })

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="700px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    openEntity={{ entity: OPEN_ENTITY.HOST, id: hostUuid }}
                    IconComponent={PiListChecks}
                    iconVariant="soft"
                    subtitle={hostUuid}
                    title={host?.remark ?? t('edit-host-modal.widget.edit-host')}
                    withCopy={true}
                />
            }
        >
            {isGetHostLoading || !host ? (
                <LoaderModalShared mih="78vh" />
            ) : (
                <EditHostDrawerContent host={host} onClose={hide} />
            )}
        </Drawer>
    )
})
