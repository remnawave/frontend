import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { CreateInternalSquadCommand } from '@remnawave/backend-contract'
import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useField } from '@mantine/form'

import { QueryKeys, useCreateInternalSquad, useGetInternalSquads } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api'

export const InternalSquadsHeaderActionButtonsFeature = () => {
    const { isFetching } = useGetInternalSquads()

    const { open: openModal, setInternalData } = useModalsStore()

    const [opened, { open, close }] = useDisclosure(false)

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
        })
    }

    const nameField = useField<CreateInternalSquadCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateInternalSquadCommand.RequestSchema.omit({
                inbounds: true
            }).safeParse({ name: value })
            return result.success ? null : result.error.errors[0]?.message
        }
    })
    const { mutate: createInternalSquad, isPending } = useCreateInternalSquad({
        mutationFns: {
            onSuccess: (data) => {
                close()
                nameField.reset()
                handleUpdate()

                setInternalData({
                    internalState: data,
                    modalKey: MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS
                })
                openModal(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)
            },
            onError: (error) => {
                nameField.setError(error.message)
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isFetching}
                onClick={handleUpdate}
                size="xs"
                variant="default"
            >
                Update
            </Button>

            <Button leftSection={<PiPlus size="1rem" />} onClick={open} size="xs" variant="default">
                Create Internal Squad
            </Button>

            <Modal centered onClose={close} opened={opened} size="md" title="Create Internal Squad">
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
                        <Text size="sm">Create a new internal squad by entering a name below.</Text>
                        <TextInput
                            description="It can't be changed later"
                            label="Squad Name"
                            placeholder="Enter squad name"
                            required
                            {...nameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button onClick={close} variant="default">
                                Cancel
                            </Button>

                            <Button loading={isPending} type="submit">
                                Create
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Group>
    )
}
