import { ActionIcon, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { TbCopy } from 'react-icons/tb'

import { hideModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useCloneHost, useGetHost } from '@shared/api/hooks'

interface IProps {
    hostUuid: string
}

export function CloneHostFeature(props: IProps) {
    const { hostUuid } = props

    const { t } = useTranslation()

    const { data: host } = useGetHost({
        route: { uuid: hostUuid },
        rQueryParams: { enabled: false }
    })

    const { mutateAsync: cloneHost, isPending: isCloneHostPending } = useCloneHost()

    const handleCloneHost = async () => {
        if (!host) {
            return
        }

        if (!host.inbound.configProfileUuid || !host.inbound.configProfileInboundUuid) {
            notifications.show({
                title: t('common.message.error'),
                message: t('edit-host-modal.widget.dangling-host-cannot-be-cloned'),
                color: 'red'
            })

            return
        }

        await cloneHost({ variables: { cloneFromUuid: host.uuid } })

        hideModal('hosts_editHostDrawer')
        queryClient.refetchQueries({ queryKey: QueryKeys.hosts.getAllHosts.queryKey })
    }

    const openModal = () =>
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.clone'),
                cancel: t('common.action.cancel')
            },
            centered: true,
            cancelProps: {
                variant: 'subtle'
            },
            confirmProps: { color: 'cyan', variant: 'soft' },
            onConfirm: () => void handleCloneHost()
        })

    return (
        <Tooltip label={t('common.action.clone')}>
            <ActionIcon
                color="cyan"
                disabled={!host}
                loading={isCloneHostPending}
                onClick={openModal}
                size="xl"
                variant="soft"
            >
                <TbCopy size="24px" />
            </ActionIcon>
        </Tooltip>
    )
}
