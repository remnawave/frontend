import { Stack, TextInput, Group, Button } from '@mantine/core'
import { useField } from '@mantine/form'
import {
    CreateSubscriptionTemplateCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { t } from 'i18next'
import { generatePath, NavigateFunction } from 'react-router'

import { queryClient } from '@shared/api'
import { QueryKeys } from '@shared/api/hooks/keys-factory'
import { useCreateSubscriptionTemplate } from '@shared/api/hooks/subscription-template/subscription-template.mutation.hooks'
import { ROUTES } from '@shared/constants/routes'

interface IProps {
    templateType: TSubscriptionTemplateType
    onClose: () => void
    navigate: NavigateFunction
}

export const CreateTemplateContent = (props: IProps) => {
    const { templateType, onClose, navigate } = props

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey
        })
    }

    const nameField = useField<CreateSubscriptionTemplateCommand.RequestBody['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateSubscriptionTemplateCommand.RequestBodySchema.omit({
                templateType: true
            }).safeParse({ name: value, templateType })
            return result.success ? null : result.error.issues[0]?.message
        }
    })
    const { mutate: createTemplate, isPending } = useCreateSubscriptionTemplate({
        mutationFns: {
            onSuccess: (data) => {
                onClose()

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
                    <Button color="gray" onClick={onClose} variant="light">
                        {t('common.action.cancel')}
                    </Button>

                    <Button color="teal" loading={isPending} type="submit">
                        {t('common.action.create')}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
