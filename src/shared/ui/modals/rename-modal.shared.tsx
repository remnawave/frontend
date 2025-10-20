import {
    UpdateConfigProfileCommand,
    UpdateExternalSquadCommand,
    UpdateInternalSquadCommand,
    UpdateSubscriptionTemplateCommand
} from '@remnawave/backend-contract'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import {
    QueryKeys,
    useUpdateConfigProfile,
    useUpdateExternalSquad,
    useUpdateInternalSquad,
    useUpdateSubscriptionTemplate
} from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api/query-client'

type RenameType = 'configProfile' | 'externalSquad' | 'internalSquad' | 'template'

interface IProps {
    renameFrom: RenameType
}

export function RenameModalShared({ renameFrom }: IProps) {
    const { t } = useTranslation()

    const { isOpen, internalState } = useModalsStore(
        (state) => state.modals[MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL]
    )
    const { close } = useModalsStore()

    const nameField = useField<string>({
        mode: 'controlled',
        initialValue: '',
        validate: (value) => {
            const result = (() => {
                if (renameFrom === 'configProfile') {
                    return UpdateConfigProfileCommand.RequestSchema.omit({ uuid: true }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'internalSquad') {
                    return UpdateInternalSquadCommand.RequestSchema.omit({ uuid: true }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'externalSquad') {
                    return UpdateExternalSquadCommand.RequestSchema.omit({ uuid: true }).safeParse({
                        name: value
                    })
                }

                return UpdateSubscriptionTemplateCommand.RequestSchema.omit({
                    uuid: true
                }).safeParse({
                    name: value
                })
            })()

            return result.success ? null : result.error.errors[0]?.message
        }
    })

    const handleModalClose = () => {
        close(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL)
    }

    const { mutate: updateInternalSquad, isPending: isUpdatingInternalSquad } =
        useUpdateInternalSquad({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
                    })
                    handleModalClose()
                }
            }
        })

    const { mutate: updateConfigProfile, isPending: isUpdatingConfigProfile } =
        useUpdateConfigProfile({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey
                    })
                    handleModalClose()
                }
            }
        })

    const { mutate: updateExternalSquad, isPending: isUpdatingExternalSquad } =
        useUpdateExternalSquad({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.externalSquads.getExternalSquads.queryKey
                    })
                    handleModalClose()
                }
            }
        })

    const { mutate: updateTemplate, isPending: isUpdatingTemplate } = useUpdateSubscriptionTemplate(
        {
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey
                    })
                    handleModalClose()
                }
            }
        }
    )

    const handleSave = async () => {
        if (await nameField.validate()) return

        if (renameFrom === 'internalSquad') {
            if (!internalState) return

            updateInternalSquad({
                variables: {
                    uuid: internalState.uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'externalSquad') {
            if (!internalState) return

            updateExternalSquad({
                variables: {
                    uuid: internalState.uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'configProfile') {
            if (!internalState) return

            updateConfigProfile({
                variables: {
                    uuid: internalState.uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'template') {
            if (!internalState) return

            updateTemplate({
                variables: {
                    uuid: internalState.uuid,
                    name: nameField.getValue()
                }
            })
        }
    }

    const isLoading =
        isUpdatingInternalSquad ||
        isUpdatingConfigProfile ||
        isUpdatingTemplate ||
        isUpdatingExternalSquad

    return (
        <Modal
            centered
            onClose={handleModalClose}
            onExitTransitionEnd={() => nameField.reset()}
            opened={isOpen}
            title={t('rename-modal.shared.rename')}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                }}
            >
                <Stack gap="md">
                    <TextInput
                        data-autofocus
                        key={nameField.key}
                        label={t('rename-modal.shared.new-name')}
                        placeholder={internalState?.name}
                        {...nameField.getInputProps()}
                        required
                    />

                    <Group justify="flex-end">
                        <Button color="gray" onClick={handleModalClose} variant="light">
                            {t('rename-modal.shared.cancel')}
                        </Button>
                        <Button
                            color="teal"
                            disabled={!!nameField.error || !nameField.getValue()}
                            leftSection={<TbDeviceFloppy size="1.2rem" />}
                            loading={isLoading}
                            style={{
                                transition: 'all 0.2s ease'
                            }}
                            type="submit"
                            variant="light"
                        >
                            {t('rename-modal.shared.save')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )
}
