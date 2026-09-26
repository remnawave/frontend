import { Stack, TextInput, Group, Button } from '@mantine/core'
import { useField } from '@mantine/form'
import { CreateExternalSquadCommand } from '@remnawave/backend-contract'
import { t } from 'i18next'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { useCreateExternalSquad } from '@shared/api/hooks/external-squads/external-squads.mutation.hooks'
import { QueryKeys } from '@shared/api/hooks/keys-factory'

interface IProps {
    onClose: () => void
}

export const CreateExternalSquadContent = (props: IProps) => {
    const { onClose } = props

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.externalSquads.getExternalSquads.queryKey
        })
    }

    const nameField = useField<CreateExternalSquadCommand.RequestBody['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateExternalSquadCommand.RequestBodySchema.safeParse({ name: value })
            return result.success ? null : result.error.issues[0]?.message
        }
    })

    const { mutate: createExternalSquad, isPending } = useCreateExternalSquad({
        mutationFns: {
            onSuccess: (data) => {
                onClose()

                handleUpdate()

                showModal('externalSquads_externalSquadsDrawer', {
                    uuid: data.uuid
                })
            },
            onError: (error) => {
                nameField.setError(error.message)
            }
        }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                createExternalSquad({
                    variables: {
                        name: nameField.getValue()
                    }
                })
            }}
        >
            <Stack gap="md">
                <TextInput
                    data-autofocus
                    label={t('header-action-buttons.feature.external-squad-name')}
                    placeholder="My Awesome Squad"
                    required
                    {...nameField.getInputProps()}
                />
                <Group justify="flex-end">
                    <Button color="gray" onClick={onClose} variant="subtle">
                        {t('common.action.cancel')}
                    </Button>

                    <Button
                        color="teal"
                        disabled={!!nameField.error || nameField.getValue().length === 0}
                        loading={isPending}
                        type="submit"
                        variant="soft"
                    >
                        {t('common.action.create')}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
