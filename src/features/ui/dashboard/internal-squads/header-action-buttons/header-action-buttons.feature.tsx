import {
    ActionIcon,
    ActionIconGroup,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import { CreateInternalSquadCommand } from '@remnawave/backend-contract'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import { QueryKeys, useCreateInternalSquad, useGetInternalSquads } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api'

export const InternalSquadsHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()
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
            <ActionIconGroup>
                <Tooltip label={t('internal-squad-header-action-buttons.feature.update')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <TbRefresh size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip
                    label={t('internal-squad-header-action-buttons.feature.create-internal-squad')}
                    withArrow
                >
                    <ActionIcon color="teal" onClick={open} radius="md" size="lg" variant="light">
                        <TbPlus size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <Modal
                centered
                onClose={close}
                opened={opened}
                size="md"
                title={t('internal-squad-header-action-buttons.feature.create-internal-squad')}
            >
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
                        <Text size="sm">
                            {t(
                                'internal-squad-header-action-buttons.feature.create-a-new-internal-squad-by-entering-a-name-below'
                            )}
                        </Text>
                        <TextInput
                            description={t(
                                'internal-squad-header-action-buttons.feature.it-cant-be-changed-later'
                            )}
                            label={t('internal-squad-header-action-buttons.feature.squad-name')}
                            placeholder={t(
                                'internal-squad-header-action-buttons.feature.enter-squad-name'
                            )}
                            required
                            {...nameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button onClick={close} variant="default">
                                {t('internal-squad-header-action-buttons.feature.cancel')}
                            </Button>

                            <Button
                                disabled={!!nameField.error || nameField.getValue().length === 0}
                                loading={isPending}
                                type="submit"
                            >
                                {t('internal-squad-header-action-buttons.feature.create')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Group>
    )
}
