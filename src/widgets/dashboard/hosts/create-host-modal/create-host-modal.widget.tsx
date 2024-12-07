import { CreateHostCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { Modal, Text } from '@mantine/core'
import { useState } from 'react'

import { useHostsStoreActions, useHostsStoreCreateModalIsOpen } from '@entities/dashboard'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'
import { useCreateHost, useGetInbounds } from '@shared/api/hooks'

export const CreateHostModalWidget = () => {
    const isModalOpen = useHostsStoreCreateModalIsOpen()
    const actions = useHostsStoreActions()

    const { data: inbounds } = useGetInbounds()

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

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={<Text fw={500}>New host</Text>}
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
