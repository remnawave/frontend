import { UpdateHostCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Modal, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import consola from 'consola/browser'

import {
    useHostsStoreActions,
    useHostsStoreEditModalHost,
    useHostsStoreEditModalIsOpen
} from '@entities/dashboard'
import { QueryKeys, useCreateHost, useGetConfigProfiles, useUpdateHost } from '@shared/api/hooks'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'
import { queryClient } from '@shared/api'

export const EditHostModalWidget = () => {
    const { t } = useTranslation()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const isModalOpen = useHostsStoreEditModalIsOpen()
    const actions = useHostsStoreActions()
    const host = useHostsStoreEditModalHost()

    const { data: configProfiles } = useGetConfigProfiles()

    const form = useForm<UpdateHostCommand.Request>({
        name: 'edit-host-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        onValuesChange: (values) => {
            if (typeof values.vlessRouteId === 'string' && values.vlessRouteId === '') {
                form.setFieldValue('vlessRouteId', null)
            }
        },
        validate: zodResolver(UpdateHostCommand.RequestSchema.omit({ uuid: true }))
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
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.hosts.getAllTags.queryKey
                })
            }
        }
    })

    const { mutate: createHost } = useCreateHost({
        mutationFns: {
            onSuccess: async () => {
                handleClose()
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.hosts.getAllTags.queryKey
                })
            }
        }
    })

    useEffect(() => {
        if (host && configProfiles) {
            let xHttpExtraParamsParsed: null | object | string
            let muxParamsParsed: null | object | string
            let sockoptParamsParsed: null | object | string

            if (typeof host.xHttpExtraParams === 'object' && host.xHttpExtraParams !== null) {
                xHttpExtraParamsParsed = JSON.stringify(host.xHttpExtraParams, null, 2)
            } else {
                xHttpExtraParamsParsed = ''
            }

            if (typeof host.muxParams === 'object' && host.muxParams !== null) {
                muxParamsParsed = JSON.stringify(host.muxParams, null, 2)
            } else {
                muxParamsParsed = ''
            }

            if (typeof host.sockoptParams === 'object' && host.sockoptParams !== null) {
                sockoptParamsParsed = JSON.stringify(host.sockoptParams, null, 2)
            } else {
                sockoptParamsParsed = ''
            }

            form.setValues({
                remark: host.remark,
                address: host.address,
                port: host.port,
                securityLayer: host.securityLayer,
                isDisabled: !host.isDisabled,
                sni: host.sni ?? undefined,
                host: host.host ?? undefined,
                path: host.path ?? undefined,
                alpn: (host.alpn as UpdateHostCommand.Request['alpn']) ?? undefined,
                fingerprint:
                    (host.fingerprint as UpdateHostCommand.Request['fingerprint']) ?? undefined,
                inbound: {
                    configProfileUuid: host.inbound.configProfileUuid ?? '',
                    configProfileInboundUuid: host.inbound.configProfileInboundUuid ?? ''
                },
                serverDescription: host.serverDescription ?? undefined,
                xHttpExtraParams: xHttpExtraParamsParsed,
                muxParams: muxParamsParsed,
                sockoptParams: sockoptParamsParsed,
                tag: host.tag ?? undefined,
                isHidden: host.isHidden,
                overrideSniFromAddress: host.overrideSniFromAddress,
                vlessRouteId: host.vlessRouteId ?? undefined
            })
        }
    }, [host, configProfiles])

    form.watch('inbound.configProfileInboundUuid', ({ value }) => {
        const { inbound } = form.getValues()
        if (!inbound?.configProfileUuid) {
            return
        }

        const configProfile = configProfiles?.configProfiles.find(
            (configProfile) => configProfile.uuid === inbound.configProfileUuid
        )
        if (configProfile) {
            form.setFieldValue(
                'port',
                configProfile.inbounds.find((inbound) => inbound.uuid === value)?.port ?? undefined
            )
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!host) {
            return
        }

        let xHttpExtraParams
        let muxParams
        let sockoptParams

        try {
            if (values.xHttpExtraParams === '') {
                xHttpExtraParams = null
            } else {
                xHttpExtraParams = JSON.parse(values.xHttpExtraParams as unknown as string)
            }
        } catch (error) {
            consola.error(error)
            xHttpExtraParams = null
            // silence
        }

        try {
            if (values.muxParams === '') {
                muxParams = null
            } else {
                muxParams = JSON.parse(values.muxParams as unknown as string)
            }
        } catch (error) {
            consola.error(error)
            muxParams = null
            // silence
        }

        try {
            if (values.sockoptParams === '') {
                sockoptParams = null
            } else {
                sockoptParams = JSON.parse(values.sockoptParams as unknown as string)
            }
        } catch (error) {
            consola.error(error)
            sockoptParams = null
            // silence
        }

        updateHost({
            variables: {
                ...values,
                isDisabled: !values.isDisabled,
                uuid: host.uuid,
                xHttpExtraParams,
                muxParams,
                sockoptParams,
                tag: values.tag === '' ? null : values.tag
            }
        })
    })

    const handleCloneHost = () => {
        if (!host) {
            return
        }

        if (!host.inbound.configProfileInboundUuid || !host.inbound.configProfileUuid) {
            notifications.show({
                title: t('edit-host-modal.widget.error'),
                message: t('edit-host-modal.widget.dangling-host-cannot-be-cloned'),
                color: 'red'
            })

            return
        }

        createHost({
            variables: {
                ...host,
                remark: `Clone #${Math.random().toString(36).substring(2, 15)}`,
                port: host.port,

                isDisabled: true,
                path: host.path ?? undefined,
                sni: host.sni ?? undefined,
                host: host.host ?? undefined,
                alpn: (host.alpn as UpdateHostCommand.Request['alpn']) ?? undefined,
                xHttpExtraParams: host.xHttpExtraParams ?? undefined,
                muxParams: host.muxParams ?? undefined,
                fingerprint:
                    (host.fingerprint as UpdateHostCommand.Request['fingerprint']) ?? undefined,
                inbound: {
                    configProfileUuid: host.inbound.configProfileUuid,
                    configProfileInboundUuid: host.inbound.configProfileInboundUuid
                },
                serverDescription: host.serverDescription ?? undefined,
                sockoptParams: host.sockoptParams ?? undefined,
                tag: host.tag ?? undefined,
                overrideSniFromAddress: host.overrideSniFromAddress,
                vlessRouteId: host.vlessRouteId ?? undefined
            }
        })
    }

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            size="30rem"
            title={<Text fw={500}>{t('edit-host-modal.widget.edit-host')}</Text>}
        >
            <BaseHostForm
                advancedOpened={advancedOpened}
                configProfiles={configProfiles?.configProfiles ?? []}
                form={form}
                handleCloneHost={handleCloneHost}
                handleSubmit={handleSubmit}
                host={host!}
                isSubmitting={isUpdateHostPending}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
