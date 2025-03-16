import { CreateHostCommand, SECURITY_LAYERS } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { Modal, Text } from '@mantine/core'
import { useEffect, useState } from 'react'

import { useHostsStoreActions, useHostsStoreCreateModalIsOpen } from '@entities/dashboard'
import { useCreateHost, useGetFullInbounds } from '@shared/api/hooks'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'

export const CreateHostModalWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useHostsStoreCreateModalIsOpen()
    const actions = useHostsStoreActions()

    const { data: inbounds } = useGetFullInbounds()

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<CreateHostCommand.Request>({
        mode: 'uncontrolled',
        name: 'create-host-form',
        validate: zodResolver(CreateHostCommand.RequestSchema)
    })

    form.watch('inboundUuid', ({ value }) => {
        const inbound = inbounds?.find((inbound) => inbound.uuid === value)
        if (inbound) {
            form.setFieldValue('port', inbound.port)
        }
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
        if (!values.inboundUuid) {
            return null
        }

        createHost({
            variables: {
                ...values,
                inboundUuid: values.inboundUuid,
                isDisabled: !values.isDisabled
            }
        })

        return null
    })

    useEffect(() => {
        form.setFieldValue('securityLayer', SECURITY_LAYERS.DEFAULT)
    }, [form])

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={<Text fw={500}>{t('create-host-modal.widget.new-host')}</Text>}
        >
            <BaseHostForm
                advancedOpened={advancedOpened}
                form={form}
                handleSubmit={handleSubmit}
                inbounds={inbounds ?? []}
                isSubmitting={isCreateHostPending}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
