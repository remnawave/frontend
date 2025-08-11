/* eslint-disable indent */

import { UpdateConfigProfileCommand, UpdateInternalSquadCommand } from '@remnawave/backend-contract'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import { QueryKeys, useUpdateConfigProfile, useUpdateInternalSquad } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api/query-client'

type RenameType = 'configProfile' | 'internalSquad'

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
            const result =
                renameFrom === 'configProfile'
                    ? UpdateConfigProfileCommand.RequestSchema.omit({ uuid: true }).safeParse({
                          name: value
                      })
                    : UpdateInternalSquadCommand.RequestSchema.omit({ uuid: true }).safeParse({
                          name: value
                      })

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
                        queryKey: QueryKeys['config-profiles'].getConfigProfiles.queryKey
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
        } else if (renameFrom === 'configProfile') {
            if (!internalState) return

            updateConfigProfile({
                variables: {
                    uuid: internalState.uuid,
                    name: nameField.getValue()
                }
            })
        }
    }

    const isLoading = isUpdatingInternalSquad || isUpdatingConfigProfile

    return (
        <Modal
            centered
            onClose={handleModalClose}
            onExitTransitionEnd={() => nameField.reset()}
            opened={isOpen}
            title={t('rename-modal.shared.rename')}
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
                    <Button onClick={handleModalClose} variant="default">
                        {t('rename-modal.shared.cancel')}
                    </Button>
                    <Button
                        color="teal"
                        disabled={!!nameField.error || !nameField.getValue()}
                        leftSection={<TbDeviceFloppy size={'1.2rem'} />}
                        loading={isLoading}
                        onClick={handleSave}
                        style={{
                            transition: 'all 0.2s ease'
                        }}
                        variant="light"
                    >
                        {t('rename-modal.shared.save')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
