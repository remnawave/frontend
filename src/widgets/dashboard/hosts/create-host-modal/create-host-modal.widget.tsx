import { CreateHostCommand, SECURITY_LAYERS } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { Modal, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'

import { useHostsStoreActions, useHostsStoreCreateModalIsOpen } from '@entities/dashboard'
import { useCreateHost, useGetConfigProfiles } from '@shared/api/hooks'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'

export const CreateHostModalWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useHostsStoreCreateModalIsOpen()
    const actions = useHostsStoreActions()

    const { data: configProfiles } = useGetConfigProfiles()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<CreateHostCommand.Request>({
        mode: 'uncontrolled',
        name: 'create-host-form',
        validate: zodResolver(CreateHostCommand.RequestSchema)
    })

    const handleClose = () => {
        actions.toggleCreateModal(false)
        setAdvancedOpened(false)

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    const { mutate: createHost, isPending: isCreateHostPending } = useCreateHost({
        mutationFns: {
            onSuccess: async () => {
                handleClose()
            }
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!values.configProfileInboundUuid || !values.configProfileUuid) {
            notifications.show({
                title: 'Error',
                message: 'Please select the config profile and inbound',
                color: 'red'
            })

            return null
        }

        createHost({
            variables: {
                ...values,
                configProfileInboundUuid: values.configProfileInboundUuid,
                configProfileUuid: values.configProfileUuid,
                isDisabled: !values.isDisabled
            }
        })

        return null
    })

    useEffect(() => {
        form.setFieldValue('securityLayer', SECURITY_LAYERS.DEFAULT)
    }, [form])

    form.watch('configProfileInboundUuid', ({ value }) => {
        const { configProfileUuid } = form.getValues()
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
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={<Text fw={500}>{t('create-host-modal.widget.new-host')}</Text>}
        >
            <BaseHostForm
                advancedOpened={advancedOpened}
                configProfiles={configProfiles?.configProfiles ?? []}
                form={form}
                handleSubmit={handleSubmit}
                isSubmitting={isCreateHostPending}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
