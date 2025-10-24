import { Button, Group, NumberInput, px, Stack, TextInput } from '@mantine/core'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { PiClock, PiLink, PiUserCircle } from 'react-icons/pi'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { useForm } from '@mantine/form'

import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

export const SubscriptionInfoCardWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'subscription-info-card-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateSubscriptionSettingsCommand.RequestSchema),
        initialValues: {
            uuid: subscriptionSettings.uuid,
            profileTitle: subscriptionSettings.profileTitle,
            supportLink: subscriptionSettings.supportLink,
            profileUpdateInterval: subscriptionSettings.profileUpdateInterval
        }
    })

    const { mutate, isPending } = useUpdateSubscriptionSettings({
        mutationFns: {
            onSuccess(data) {
                queryClient.setQueryData(
                    QueryKeys.subscriptionSettings.getSubscriptionSettings.queryKey,
                    data
                )
            },

            onError(error) {
                handleFormErrors(form, error)
            }
        }
    })

    const handleSubmit = form.onSubmit((values) => {
        mutate({
            variables: {
                uuid: values.uuid,
                profileTitle: values.profileTitle,
                supportLink: values.supportLink,
                profileUpdateInterval: values.profileUpdateInterval
            }
        })
    })

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('subscription-settings.widget.subscription-info-description')}
                    icon={<PiUserCircle size={24} />}
                    title={t('subscription-settings.widget.subscription-info')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="xs">
                        <TextInput
                            description={t(
                                'subscription-settings.widget.this-title-will-be-displayed-as-subscription-name'
                            )}
                            key={form.key('profileTitle')}
                            label={t('subscription-settings.widget.profile-title')}
                            leftSection={<TemplateInfoPopoverShared showHostDescription={false} />}
                            placeholder={t('subscription-settings.widget.enter-profile-title')}
                            size="sm"
                            {...form.getInputProps('profileTitle')}
                        />

                        <NumberInput
                            description={t('subscription-settings.widget.auto-update-description')}
                            key={form.key('profileUpdateInterval')}
                            label={t('subscription-settings.widget.auto-update-interval-hours')}
                            leftSection={<PiClock size={px('1.2rem')} />}
                            min={1}
                            placeholder="60"
                            size="sm"
                            {...form.getInputProps('profileUpdateInterval')}
                        />

                        <TextInput
                            description={t('subscription-settings.widget.support-link-description')}
                            key={form.key('supportLink')}
                            label={t('subscription-settings.widget.support-link')}
                            leftSection={<PiLink size={px('1.2rem')} />}
                            placeholder="https://support.example.com"
                            size="sm"
                            {...form.getInputProps('supportLink')}
                        />
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button color="teal" loading={isPending} size="md" type="submit">
                            {t('branding-settings-card.widget.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
