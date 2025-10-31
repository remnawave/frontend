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
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { HelpActionIconShared } from '@shared/ui/help-drawer'
import { queryClient } from '@shared/api'

export const InternalSquadsHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()
    const { isFetching } = useGetInternalSquads()

    const openModalWithData = useModalsStoreOpenWithData()

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

                openModalWithData(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS, data)
            },

            onError: (error) => {
                nameField.setError(error.message)
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <HelpActionIconShared hidden={false} screen="PAGE_INTERNAL_SQUADS" />

            <ActionIconGroup>
                <Tooltip label={t('common.update')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="input-md"
                        variant="light"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip
                    label={t('internal-squad-header-action-buttons.feature.create-internal-squad')}
                    withArrow
                >
                    <ActionIcon color="teal" onClick={open} size="input-md" variant="light">
                        <TbPlus size="24px" />
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
                            data-autofocus
                            label={t('internal-squad-header-action-buttons.feature.squad-name')}
                            placeholder={t(
                                'internal-squad-header-action-buttons.feature.enter-squad-name'
                            )}
                            required
                            {...nameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button color="gray" onClick={close} variant="light">
                                {t('common.cancel')}
                            </Button>

                            <Button
                                color="teal"
                                disabled={!!nameField.error || nameField.getValue().length === 0}
                                loading={isPending}
                                type="submit"
                                variant="default"
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
