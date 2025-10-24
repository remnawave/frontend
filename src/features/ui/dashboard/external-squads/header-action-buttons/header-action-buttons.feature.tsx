import {
    ActionIcon,
    ActionIconGroup,
    Button,
    Group,
    Modal,
    Stack,
    TextInput,
    Tooltip
} from '@mantine/core'
import { CreateExternalSquadCommand } from '@remnawave/backend-contract'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import { QueryKeys, useCreateExternalSquad, useGetExternalSquads } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api'

export const ExternalSquadsHeaderActionButtonsFeature = () => {
    const { isFetching } = useGetExternalSquads()
    const { t } = useTranslation()

    const { open: openModal, setInternalData } = useModalsStore()

    const [opened, { open, close }] = useDisclosure(false)

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.externalSquads.getExternalSquads.queryKey
        })
    }

    const nameField = useField<CreateExternalSquadCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateExternalSquadCommand.RequestSchema.safeParse({ name: value })
            return result.success ? null : result.error.errors[0]?.message
        }
    })

    const { mutate: createExternalSquad, isPending } = useCreateExternalSquad({
        mutationFns: {
            onSuccess: (data) => {
                close()
                nameField.reset()
                handleUpdate()

                setInternalData({
                    internalState: data,
                    modalKey: MODALS.EXTERNAL_SQUAD_DRAWER
                })
                openModal(MODALS.EXTERNAL_SQUAD_DRAWER)
            },
            onError: (error) => {
                nameField.setError(error.message)
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIconGroup>
                <Tooltip
                    label={t('header-action-buttons.feature.update-external-squads')}
                    withArrow
                >
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="lg"
                        variant="light"
                    >
                        <TbRefresh size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip
                    label={t('header-action-buttons.feature.create-new-external-squad')}
                    withArrow
                >
                    <ActionIcon color="teal" onClick={open} size="lg" variant="light">
                        <TbPlus size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <Modal
                centered
                onClose={close}
                opened={opened}
                size="md"
                title={t('header-action-buttons.feature.create-new-external-squad')}
            >
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
                            <Button color="gray" onClick={close} variant="subtle">
                                {t('common.cancel')}
                            </Button>

                            <Button
                                color="teal"
                                disabled={!!nameField.error || nameField.getValue().length === 0}
                                loading={isPending}
                                type="submit"
                                variant="light"
                            >
                                {t('common.create')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Group>
    )
}
