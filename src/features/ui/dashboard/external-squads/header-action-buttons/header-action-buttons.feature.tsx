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
import { TbPlus, TbRefresh, TbWebhook } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'
import { useCreateExternalSquad, useGetExternalSquads } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { HelpActionIconShared } from '@shared/ui/help-drawer'

interface IProps {
    externalSquadCount: number
}

export const ExternalSquadsHeaderActionButtonsFeature = (props: IProps) => {
    const { externalSquadCount } = props

    const { isFetching, refetch: refetchExternalSquads } = useGetExternalSquads()
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    const [opened, { open, close }] = useDisclosure(false)

    const handleUpdate = async () => {
        await refetchExternalSquads()
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

                openModalWithData(MODALS.EXTERNAL_SQUAD_DRAWER, data.uuid)
            },
            onError: (error) => {
                nameField.setError(error.message)
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <HelpActionIconShared hidden={false} screen="PAGE_EXTERNAL_SQUADS" />

            {externalSquadCount > 0 && <UniversalSpotlightActionIconShared />}

            <ActionIconGroup>
                <Tooltip
                    label={t('header-action-buttons.feature.update-external-squads')}
                    withArrow
                >
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
                    label={t('header-action-buttons.feature.create-new-external-squad')}
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
                title={
                    <BaseOverlayHeader
                        IconComponent={TbWebhook}
                        iconVariant="gradient-teal"
                        title={t('header-action-buttons.feature.create-new-external-squad')}
                    />
                }
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
