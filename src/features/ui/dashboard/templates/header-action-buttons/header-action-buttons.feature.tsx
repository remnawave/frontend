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
import {
    CreateSubscriptionTemplateCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import {
    QueryKeys,
    useCreateSubscriptionTemplate,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'
import { ROUTES } from '@shared/constants'
import { queryClient } from '@shared/api'

interface IProps {
    templateType: TSubscriptionTemplateType
}

export const TemplatesHeaderActionButtonsFeature = (props: IProps) => {
    const { templateType } = props
    const { t } = useTranslation()

    const { isFetching } = useGetSubscriptionTemplates()

    const [opened, { open, close }] = useDisclosure(false)
    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey
        })
    }

    const nameField = useField<CreateSubscriptionTemplateCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateSubscriptionTemplateCommand.RequestSchema.omit({
                templateType: true
            }).safeParse({ name: value, templateType })
            return result.success ? null : result.error.errors[0]?.message
        }
    })
    const { mutate: createTemplate, isPending } = useCreateSubscriptionTemplate({
        mutationFns: {
            onSuccess: (data) => {
                close()
                nameField.reset()
                handleUpdate()
                navigate(
                    generatePath(ROUTES.DASHBOARD.TEMPLATES.TEMPLATE_EDITOR, {
                        type: data.templateType,
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
                <Tooltip label={t('header-action-buttons.feature.update-templates')} withArrow>
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
                <Tooltip label={t('header-action-buttons.feature.create-new-template')} withArrow>
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
                title={t('header-action-buttons.feature.create-new-template')}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createTemplate({
                            variables: {
                                name: nameField.getValue(),
                                templateType
                            }
                        })
                    }}
                >
                    <Stack gap="md">
                        <TextInput
                            data-autofocus
                            label={t('header-action-buttons.feature.template-name')}
                            placeholder="My Mihomo template"
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
