import { CreateHostCommand, SECURITY_LAYERS } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { Drawer, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'

import {
    QueryKeys,
    useCreateHost,
    useGetConfigProfiles,
    useGetInternalSquads,
    useGetNodes,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'
import { queryClient } from '@shared/api'

export const CreateHostModalWidget = () => {
    const { t } = useTranslation()

    const { isOpen } = useModalState(MODALS.CREATE_HOST_MODAL)
    const close = useModalClose(MODALS.CREATE_HOST_MODAL)

    const { data: configProfiles } = useGetConfigProfiles()
    const { data: nodes } = useGetNodes()
    const { data: internalSquads } = useGetInternalSquads()
    const { data: templates } = useGetSubscriptionTemplates()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<CreateHostCommand.Request>({
        mode: 'uncontrolled',
        name: 'create-host-form',
        validateInputOnBlur: true,
        onValuesChange: (values) => {
            if (typeof values.vlessRouteId === 'string' && values.vlessRouteId === '') {
                form.setFieldValue('vlessRouteId', null)
            }
        },
        validate: zodResolver(CreateHostCommand.RequestSchema),

        initialValues: {
            securityLayer: SECURITY_LAYERS.DEFAULT,
            port: 0,
            remark: '',
            address: '',
            inbound: {
                configProfileUuid: '',
                configProfileInboundUuid: ''
            }
        }
    })

    const handleClose = () => {
        close()
        setAdvancedOpened(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    const { mutate: createHost, isPending: isCreateHostPending } = useCreateHost({
        mutationFns: {
            onSuccess: async () => {
                handleClose()
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.hosts.getAllTags.queryKey
                })
            }
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!values.inbound.configProfileInboundUuid || !values.inbound.configProfileUuid) {
            notifications.show({
                title: t('create-host-modal.widget.error'),
                message: t('create-host-modal.widget.please-select-the-config-profile-and-inbound'),
                color: 'red'
            })

            return null
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
        } catch {
            xHttpExtraParams = null
            // silence
        }

        try {
            if (values.muxParams === '') {
                muxParams = null
            } else {
                muxParams = JSON.parse(values.muxParams as unknown as string)
            }
        } catch {
            muxParams = null
            // silence
        }

        try {
            if (values.sockoptParams === '') {
                sockoptParams = null
            } else {
                sockoptParams = JSON.parse(values.sockoptParams as unknown as string)
            }
        } catch {
            sockoptParams = null
            // silence
        }

        createHost({
            variables: {
                ...values,
                isDisabled: !values.isDisabled,
                sockoptParams,
                muxParams,
                xHttpExtraParams,
                inbound: {
                    configProfileInboundUuid: values.inbound.configProfileInboundUuid,
                    configProfileUuid: values.inbound.configProfileUuid
                }
            }
        })

        return null
    })

    form.watch('inbound.configProfileInboundUuid', ({ value }) => {
        const { configProfileUuid } = form.getValues().inbound
        if (!configProfileUuid) {
            return
        }

        const configProfile = configProfiles?.configProfiles.find(
            (configProfile) => configProfile.uuid === configProfileUuid
        )
        if (configProfile) {
            form.setFieldValue(
                'port',
                configProfile.inbounds.find((inbound) => inbound.uuid === value)?.port ?? 0
            )
        }
    })

    return (
        <Drawer
            keepMounted={false}
            onClose={handleClose}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="lg"
            title={<Text fw={500}>{t('create-host-modal.widget.new-host')}</Text>}
        >
            <BaseHostForm
                advancedOpened={advancedOpened}
                configProfiles={configProfiles?.configProfiles ?? []}
                form={form}
                handleSubmit={handleSubmit}
                internalSquads={internalSquads?.internalSquads ?? []}
                isSubmitting={isCreateHostPending}
                nodes={nodes!}
                setAdvancedOpened={setAdvancedOpened}
                subscriptionTemplates={templates?.templates ?? []}
            />
        </Drawer>
    )
}
