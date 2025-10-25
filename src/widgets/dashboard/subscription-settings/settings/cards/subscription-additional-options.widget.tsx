import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { Button, Group, Stack, Switch } from '@mantine/core'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { PiGear } from 'react-icons/pi'
import { useForm } from '@mantine/form'

import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

export const SubscriptionAdditionalOptionsWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'subscription-additional-options-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateSubscriptionSettingsCommand.RequestSchema),
        initialValues: {
            uuid: subscriptionSettings.uuid,
            serveJsonAtBaseSubscription: subscriptionSettings.serveJsonAtBaseSubscription,
            addUsernameToBaseSubscription: subscriptionSettings.addUsernameToBaseSubscription,
            randomizeHosts: subscriptionSettings.randomizeHosts,
            isShowCustomRemarks: subscriptionSettings.isShowCustomRemarks,
            isProfileWebpageUrlEnabled: subscriptionSettings.isProfileWebpageUrlEnabled
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
                serveJsonAtBaseSubscription: values.serveJsonAtBaseSubscription,
                addUsernameToBaseSubscription: values.addUsernameToBaseSubscription,
                randomizeHosts: values.randomizeHosts,
                isShowCustomRemarks: values.isShowCustomRemarks,
                isProfileWebpageUrlEnabled: values.isProfileWebpageUrlEnabled
            }
        })
    })

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t(
                        'subscription-tabs.widget.configure-additional-subscription-options'
                    )}
                    icon={<PiGear size={24} />}
                    title={t('subscription-tabs.widget.additional-options')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Switch
                            description={t('subscription-settings.widget.serve-json-description')}
                            key={form.key('serveJsonAtBaseSubscription')}
                            label={t(
                                'subscription-settings.widget.serve-json-at-base-subscription'
                            )}
                            size="sm"
                            {...form.getInputProps('serveJsonAtBaseSubscription', {
                                type: 'checkbox'
                            })}
                        />

                        <Switch
                            description={t('subscription-tabs.widget.randomize-hosts-description')}
                            key={form.key('randomizeHosts')}
                            label={t('subscription-tabs.widget.randomize-hosts')}
                            size="sm"
                            {...form.getInputProps('randomizeHosts', {
                                type: 'checkbox'
                            })}
                        />

                        <Switch
                            description={t(
                                'subscription-settings.widget.profile-webpage-url-description'
                            )}
                            key={form.key('isProfileWebpageUrlEnabled')}
                            label={t('subscription-settings.widget.profile-webpage-url')}
                            size="sm"
                            {...form.getInputProps('isProfileWebpageUrlEnabled', {
                                type: 'checkbox'
                            })}
                        />

                        <Switch
                            description={t(
                                'subscription-tabs.widget.show-custom-remark-description-line-2'
                            )}
                            key={form.key('isShowCustomRemarks')}
                            label={t('subscription-tabs.widget.show-custom-remarks')}
                            size="sm"
                            {...form.getInputProps('isShowCustomRemarks', {
                                type: 'checkbox'
                            })}
                        />

                        <Switch
                            description={t('subscription-settings.widget.add-username-description')}
                            key={form.key('addUsernameToBaseSubscription')}
                            label={t(
                                'subscription-settings.widget.add-username-to-base-subscription'
                            )}
                            size="sm"
                            {...form.getInputProps('addUsernameToBaseSubscription', {
                                type: 'checkbox'
                            })}
                        />
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button color="teal" loading={isPending} size="md" type="submit">
                            {t('common.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
