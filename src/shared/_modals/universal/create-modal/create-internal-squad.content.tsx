import { Stack, TextInput, Group, Button } from '@mantine/core'
import { useField } from '@mantine/form'
import { CreateInternalSquadCommand } from '@remnawave/backend-contract'
import { t } from 'i18next'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { useCreateInternalSquad } from '@shared/api/hooks/internal-squads/internal-squads.mutation.hooks'
import { QueryKeys } from '@shared/api/hooks/keys-factory'

interface IProps {
    onClose: () => void
}

export const CreateInternalSquadContent = (props: IProps) => {
    const { onClose } = props

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
        })
    }

    const nameField = useField<CreateInternalSquadCommand.RequestBody['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateInternalSquadCommand.RequestBodySchema.omit({
                inbounds: true
            }).safeParse({ name: value })
            return result.success ? null : result.error.issues[0]?.message
        }
    })
    const { mutate: createInternalSquad, isPending } = useCreateInternalSquad({
        mutationFns: {
            onSuccess: (data) => {
                onClose()

                handleUpdate()

                showModal('internalSquads_internalSquadsInboundsDrawer', {
                    squadUuid: data.uuid
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
                createInternalSquad({
                    variables: {
                        name: nameField.getValue(),
                        inbounds: []
                    }
                })
            }}
        >
            <Stack gap="md">
                <TextInput
                    data-autofocus
                    label={t('internal-squad-header-action-buttons.feature.squad-name')}
                    placeholder={t('internal-squad-header-action-buttons.feature.enter-squad-name')}
                    required
                    {...nameField.getInputProps()}
                />
                <Group justify="flex-end">
                    <Button color="gray" onClick={onClose} variant="soft">
                        {t('common.action.cancel')}
                    </Button>

                    <Button
                        color="teal"
                        disabled={!!nameField.error || nameField.getValue().length === 0}
                        loading={isPending}
                        type="submit"
                        variant="default"
                    >
                        {t('common.action.create')}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
