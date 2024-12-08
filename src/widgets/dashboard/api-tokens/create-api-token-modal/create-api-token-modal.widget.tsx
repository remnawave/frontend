import { CreateApiTokenCommand } from '@remnawave/backend-contract'
import { useForm, zodResolver } from '@mantine/form'
import { Group, Modal, Text } from '@mantine/core'

import {
    useApiTokensStoreActions,
    useApiTokensStoreCreateModalIsOpen
} from '@entities/dashboard/api-tokens/api-tokens-store'
import { BaseApiTokenForm } from '@shared/ui/forms/api-tokens/base-api-token-form'
import { useCreateApiToken } from '@shared/api/hooks'

export const CreateApiTokenModalWidget = () => {
    const isModalOpen = useApiTokensStoreCreateModalIsOpen()
    const actions = useApiTokensStoreActions()

    const form = useForm<CreateApiTokenCommand.Request>({
        name: 'create-api-token-form',
        mode: 'uncontrolled',
        validate: zodResolver(CreateApiTokenCommand.RequestSchema)
    })

    const handleClose = () => {
        actions.toggleCreateModal(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
        }, 300)
    }

    const { mutate: createApiToken, isPending: isCreateApiTokenPending } = useCreateApiToken({
        mutationFns: {
            onSuccess: () => {
                handleClose()
            }
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        createApiToken({
            variables: {
                ...values
            }
        })
    })

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isModalOpen}
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>Create token</Text>
                </Group>
            }
        >
            <BaseApiTokenForm
                form={form}
                handleSubmit={handleSubmit}
                isCreateApiTokenPending={isCreateApiTokenPending}
            />
        </Modal>
    )
}
