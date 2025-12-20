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
import { CreateSubscriptionPageConfigCommand } from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbFile, TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import {
    QueryKeys,
    useCreateSubscriptionPageConfig,
    useGetSubscriptionPageConfigs
} from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { ROUTES } from '@shared/constants'
import { queryClient } from '@shared/api'

export const SubpageConfigsHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const { isFetching } = useGetSubscriptionPageConfigs()

    const [opened, { open, close }] = useDisclosure(false)
    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.subpageConfigs.getSubscriptionPageConfigs.queryKey
        })
    }

    const nameField = useField<CreateSubscriptionPageConfigCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateSubscriptionPageConfigCommand.RequestSchema.safeParse({
                name: value
            })
            return result.success ? null : result.error.errors[0]?.message
        }
    })
    const { mutate: createSubscriptionPageConfig, isPending } = useCreateSubscriptionPageConfig({
        mutationFns: {
            onSuccess: (data) => {
                close()
                nameField.reset()
                handleUpdate()
                navigate(
                    generatePath(ROUTES.DASHBOARD.SUBPAGE_CONFIGS.SUBPAGE_CONFIG_BY_UUID, {
                        uuid: data.uuid
                    })
                )
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <UniversalSpotlightActionIconShared />

            <ActionIconGroup>
                <Tooltip label={t('common.refresh')} withArrow>
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
                <ActionIcon color="teal" onClick={open} size="input-md" variant="light">
                    <TbPlus size="24px" />
                </ActionIcon>
            </ActionIconGroup>

            <Modal
                centered
                onClose={close}
                opened={opened}
                size="md"
                title={
                    <BaseOverlayHeader
                        IconComponent={TbFile}
                        iconVariant="gradient-teal"
                        title={t('common.create')}
                    />
                }
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createSubscriptionPageConfig({
                            variables: {
                                name: nameField.getValue()
                            }
                        })
                    }}
                >
                    <Stack gap="md">
                        <TextInput
                            data-autofocus
                            label={t('common.name')}
                            placeholder="My Subscription Page Config"
                            required
                            {...nameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button color="gray" onClick={close} variant="light">
                                {t('common.cancel')}
                            </Button>

                            <Button color="teal" loading={isPending} type="submit">
                                {t('common.create')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Group>
    )
}
