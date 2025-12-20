import {
    UpdateConfigProfileCommand,
    UpdateExternalSquadCommand,
    UpdateInternalSquadCommand,
    UpdatePasskeyCommand,
    UpdateSubscriptionPageConfigCommand,
    UpdateSubscriptionTemplateCommand
} from '@remnawave/backend-contract'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { TbDeviceFloppy, TbPencil } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import {
    QueryKeys,
    useUpdateConfigProfile,
    useUpdateExternalSquad,
    useUpdateInternalSquad,
    useUpdatePasskey,
    useUpdateSubscriptionPageConfig,
    useUpdateSubscriptionTemplate
} from '@shared/api/hooks'
import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api/query-client'

import { BaseOverlayHeader } from '../overlays/base-overlay-header'

type RenameType =
    | 'configProfile'
    | 'externalSquad'
    | 'internalSquad'
    | 'passkey'
    | 'subpageConfig'
    | 'template'

interface IProps {
    renameFrom: RenameType
}

export function RenameModalShared({ renameFrom }: IProps) {
    const { t } = useTranslation()

    const { isOpen, internalState } = useModalState(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL)
    const close = useModalClose(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL)

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

                if (renameFrom === 'passkey') {
                    return UpdatePasskeyCommand.RequestSchema.omit({ id: true }).safeParse({
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

                if (renameFrom === 'subpageConfig') {
                    return UpdateSubscriptionPageConfigCommand.RequestSchema.omit({
                        uuid: true
                    }).safeParse({
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
        close()
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

    const { mutate: updatePasskey, isPending: isUpdatingPasskey } = useUpdatePasskey({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.passkeys.getAllPasskeys.queryKey
                })
                handleModalClose()
            }
        }
    })

    const { mutate: updateSubpageConfig, isPending: isUpdatingSubpageConfig } =
        useUpdateSubscriptionPageConfig({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.subpageConfigs.getSubscriptionPageConfigs.queryKey
                    })
                    handleModalClose()
                }
            }
        })

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
        } else if (renameFrom === 'passkey') {
            if (!internalState) return

            updatePasskey({
                variables: {
                    id: internalState.uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'subpageConfig') {
            if (!internalState) return

            updateSubpageConfig({
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
        isUpdatingExternalSquad ||
        isUpdatingPasskey ||
        isUpdatingSubpageConfig

    return (
        <Modal
            centered
            onClose={handleModalClose}
            onExitTransitionEnd={() => nameField.reset()}
            opened={isOpen}
            title={
                <BaseOverlayHeader
                    IconComponent={TbPencil}
                    iconVariant="gradient-teal"
                    title={t('common.rename')}
                />
            }
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
                            {t('common.cancel')}
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
                            {t('common.save')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )
}
