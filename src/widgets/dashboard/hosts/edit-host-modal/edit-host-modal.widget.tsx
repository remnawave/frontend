import { UpdateHostCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Modal, Text } from '@mantine/core'

import {
    useHostsStoreActions,
    useHostsStoreEditModalHost,
    useHostsStoreEditModalIsOpen
} from '@entities/dashboard'
import { useCreateHost, useGetInbounds, useUpdateHost } from '@shared/api/hooks'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'

export const EditHostModalWidget = () => {
    const { t } = useTranslation()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const isModalOpen = useHostsStoreEditModalIsOpen()
    const actions = useHostsStoreActions()
    const host = useHostsStoreEditModalHost()

    const { data: inbounds } = useGetInbounds()

    const form = useForm<UpdateHostCommand.Request>({
        name: 'edit-host-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            UpdateHostCommand.RequestSchema.omit({ uuid: true, xHttpExtraParams: true })
        )
    })

    const handleClose = () => {
        actions.toggleEditModal(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
            setAdvancedOpened(false)
        }, 200)
    }

    const { mutate: updateHost, isPending: isUpdateHostPending } = useUpdateHost({
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    })

    const { mutate: createHost } = useCreateHost({
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    })

    useEffect(() => {
        if (host && inbounds) {
            let xHttpExtraParamsParsed: null | object | string

            if (typeof host.xHttpExtraParams === 'object' && host.xHttpExtraParams !== null) {
                xHttpExtraParamsParsed = JSON.stringify(host.xHttpExtraParams, null, 2)
            } else {
                xHttpExtraParamsParsed = ''
            }

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
                xHttpExtraParams: xHttpExtraParamsParsed,
                fingerprint:
                    (host.fingerprint as UpdateHostCommand.Request['fingerprint']) ?? undefined
            })
        }
    }, [host, inbounds])

    form.watch('inboundUuid', ({ value }) => {
        const inbound = inbounds?.find((inbound) => inbound.uuid === value)
        if (inbound) {
            form.setFieldValue('port', inbound.port)
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!host) {
            return
        }

        let xHttpExtraParams

        try {
            if (values.xHttpExtraParams === '') {
                xHttpExtraParams = null
            } else {
                xHttpExtraParams = JSON.parse(values.xHttpExtraParams as unknown as string)
            }
        } catch (error) {
            xHttpExtraParams = null
            // silence
        }

        updateHost({
            variables: {
                ...values,
                isDisabled: !values.isDisabled,
                uuid: host.uuid,
                xHttpExtraParams
            }
        })
    })

    const handleCloneHost = () => {
        if (!host) {
            return
        }

        createHost({
            variables: {
                ...host,
                remark: `Clone #${Math.random().toString(36).substring(2, 15)}`,
                port: host.port,
                inboundUuid: host.inboundUuid,
                isDisabled: true,
                path: host.path ?? undefined,
                sni: host.sni ?? undefined,
                host: host.host ?? undefined,
                alpn: (host.alpn as UpdateHostCommand.Request['alpn']) ?? undefined,
                xHttpExtraParams: host.xHttpExtraParams ?? undefined,
                fingerprint:
                    (host.fingerprint as UpdateHostCommand.Request['fingerprint']) ?? undefined
            }
        })
    }

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
                handleCloneHost={handleCloneHost}
                handleSubmit={handleSubmit}
                host={host!}
                inbounds={inbounds ?? []}
                isSubmitting={isUpdateHostPending}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
