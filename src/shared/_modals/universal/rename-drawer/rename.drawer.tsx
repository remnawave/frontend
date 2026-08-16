import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useField } from '@mantine/form'
import {
    UpdateConfigProfileCommand,
    UpdateExternalSquadCommand,
    UpdateInternalSquadCommand,
    UpdateNodePluginCommand,
    UpdatePasskeyCommand,
    UpdateSubpageConfigCommand,
    UpdateSubscriptionTemplateCommand
} from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy, TbPencil } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    QueryKeys,
    useUpdateConfigProfile,
    useUpdateExternalSquad,
    useUpdateInternalSquad,
    useUpdateNodePlugin,
    useUpdatePasskey,
    useUpdateSubpageConfig,
    useUpdateSubscriptionTemplate
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type RenameType =
    | 'configProfile'
    | 'externalSquad'
    | 'internalSquad'
    | 'nodePlugin'
    | 'passkey'
    | 'subpageConfig'
    | 'template'

interface IProps {
    renameFrom: RenameType
    uuid: string
    name: string
}

export const RenameModalShared = NiceModal.create((props: IProps) => {
    const { renameFrom, uuid, name } = props
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const nameField = useField<string>({
        mode: 'controlled',
        initialValue: '',
        validate: (value) => {
            const result = (() => {
                if (renameFrom === 'configProfile') {
                    return UpdateConfigProfileCommand.RequestBodySchema.omit({
                        uuid: true
                    }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'passkey') {
                    return UpdatePasskeyCommand.RequestBodySchema.omit({ id: true }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'internalSquad') {
                    return UpdateInternalSquadCommand.RequestBodySchema.omit({
                        uuid: true
                    }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'externalSquad') {
                    return UpdateExternalSquadCommand.RequestBodySchema.omit({
                        uuid: true
                    }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'subpageConfig') {
                    return UpdateSubpageConfigCommand.RequestBodySchema.omit({
                        uuid: true
                    }).safeParse({
                        name: value
                    })
                }

                if (renameFrom === 'nodePlugin') {
                    return UpdateNodePluginCommand.RequestBodySchema.omit({ uuid: true }).safeParse(
                        {
                            name: value
                        }
                    )
                }

                return UpdateSubscriptionTemplateCommand.RequestBodySchema.omit({
                    uuid: true
                }).safeParse({
                    name: value
                })
            })()

            return result.success ? null : result.error.issues[0]?.message
        }
    })

    const { mutate: updateInternalSquad, isPending: isUpdatingInternalSquad } =
        useUpdateInternalSquad({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
                    })
                    hide()
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
                    hide()
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
                    hide()
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
                    hide()
                }
            }
        }
    )

    const { mutate: updatePasskey, isPending: isUpdatingPasskey } = useUpdatePasskey({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.passkeys.getPasskeys.queryKey
                })
                hide()
            }
        }
    })

    const { mutate: updateSubpageConfig, isPending: isUpdatingSubpageConfig } =
        useUpdateSubpageConfig({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.subpageConfigs.getSubpageConfigs.queryKey
                    })
                    hide()
                }
            }
        })

    const { mutate: updateNodePlugin, isPending: isUpdatingNodePlugin } = useUpdateNodePlugin({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
                })
                hide()
            }
        }
    })

    const handleSave = async () => {
        if (await nameField.validate()) return

        if (renameFrom === 'internalSquad') {
            updateInternalSquad({
                variables: {
                    uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'externalSquad') {
            updateExternalSquad({
                variables: {
                    uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'configProfile') {
            updateConfigProfile({
                variables: {
                    uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'template') {
            updateTemplate({
                variables: {
                    uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'passkey') {
            updatePasskey({
                variables: {
                    id: uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'subpageConfig') {
            updateSubpageConfig({
                variables: {
                    uuid,
                    name: nameField.getValue()
                }
            })
        } else if (renameFrom === 'nodePlugin') {
            updateNodePlugin({
                variables: {
                    uuid,
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
        isUpdatingSubpageConfig ||
        isUpdatingNodePlugin

    return (
        <Modal
            {...modalProps}
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbPencil}
                    iconVariant="soft"
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
                        placeholder={name}
                        {...nameField.getInputProps()}
                        required
                    />

                    <Group justify="flex-end">
                        <Button
                            color="teal"
                            disabled={!!nameField.error || !nameField.getValue()}
                            leftSection={<TbDeviceFloppy size="1.2rem" />}
                            loading={isLoading}
                            style={{
                                transition: 'all 0.2s ease'
                            }}
                            type="submit"
                            variant="soft"
                        >
                            {t('common.save')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )
})
