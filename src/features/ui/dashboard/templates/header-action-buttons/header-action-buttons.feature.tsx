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
import {
    CreateSubscriptionTemplateCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useField } from '@mantine/form'

import {
    QueryKeys,
    useCreateSubscriptionTemplate,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'
import { queryClient } from '@shared/api'

interface IProps {
    templateType: TSubscriptionTemplateType
}

export const TemplatesHeaderActionButtonsFeature = (props: IProps) => {
    const { templateType } = props
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
            <ActionIconGroup>
                <Tooltip label="Update templates" withArrow>
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
                <Tooltip label="Create new template" withArrow>
                    <ActionIcon color="teal" onClick={open} size="lg" variant="light">
                        <TbPlus size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <Modal centered onClose={close} opened={opened} size="md" title="Create new template">
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
                        <Text size="sm">Create a new template by entering a name below.</Text>
                        <TextInput
                            data-autofocus
                            label="Template name"
                            placeholder="My Mihomo template"
                            required
                            {...nameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button color="gray" onClick={close} variant="light">
                                Cancel
                            </Button>

                            <Button color="teal" loading={isPending} type="submit">
                                Create
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Group>
    )
}
