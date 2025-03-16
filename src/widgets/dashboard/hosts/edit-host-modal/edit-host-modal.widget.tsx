import { UpdateHostCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { Modal, Text } from '@mantine/core'
import { useEffect, useState } from 'react'

import {
    useHostsStoreActions,
    useHostsStoreEditModalHost,
    useHostsStoreEditModalIsOpen
} from '@entities/dashboard'
import { useGetFullInbounds, useUpdateHost } from '@shared/api/hooks'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'

export const EditHostModalWidget = () => {
    const { t } = useTranslation()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const isModalOpen = useHostsStoreEditModalIsOpen()
    const actions = useHostsStoreActions()
    const host = useHostsStoreEditModalHost()

    const { data: inbounds } = useGetFullInbounds()

    const form = useForm<UpdateHostCommand.Request>({
        name: 'edit-host-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateHostCommand.RequestSchema.omit({ uuid: true }))
    })

    form.watch('inboundUuid', ({ value }) => {
        const inbound = inbounds?.find((inbound) => inbound.uuid === value)
        if (inbound) {
            form.setFieldValue('port', inbound.port)
        }
    })

    const handleClose = () => {
        actions.toggleEditModal(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    const { mutate: updateHost, isPending: isUpdateHostPending } = useUpdateHost({
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    })

    useEffect(() => {
        if (host && inbounds) {
            form.setValues({
                remark: host.remark,
                address: host.address,
                port: host.port,
                inboundUuid: host.inboundUuid,
                securityLayer: host.securityLayer,
                isDisabled: !host.isDisabled,
                sni: host.sni ?? undefined,
                host: host.host ?? undefined,
                path: host.path ?? undefined,
                alpn: (host.alpn as UpdateHostCommand.Request['alpn']) ?? undefined,
                fingerprint:
                    (host.fingerprint as UpdateHostCommand.Request['fingerprint']) ?? undefined
            })
        }
    }, [host, inbounds])

    const handleSubmit = form.onSubmit(async (values) => {
        if (!host) {
            return
        }

        updateHost({
            variables: {
                ...values,
                isDisabled: !values.isDisabled,
                uuid: host.uuid
            }
        })
    })

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={<Text fw={500}>{t('edit-host-modal.widget.edit-host')}</Text>}
        >
            <BaseHostForm
                advancedOpened={advancedOpened}
                form={form}
                handleSubmit={handleSubmit}
                host={host!}
                inbounds={inbounds ?? []}
                isSubmitting={isUpdateHostPending}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
