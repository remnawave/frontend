import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { Button, Group, px, Stack, Textarea } from '@mantine/core'
import { PiDeviceMobile, PiGear } from 'react-icons/pi'
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

export const SubscriptionAnnounceRoutingCardWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'subscription-announce-routing-card-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateSubscriptionSettingsCommand.RequestSchema),
        initialValues: {
            uuid: subscriptionSettings.uuid,
            happAnnounce: subscriptionSettings.happAnnounce,
            happRouting: subscriptionSettings.happRouting
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
                happAnnounce: values.happAnnounce,
                happRouting: values.happRouting
            }
        })
    })

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('subscription-tabs.widget.announce-and-routing-description')}
                    icon={<PiDeviceMobile size={24} />}
                    title={t('subscription-tabs.widget.announce-and-routing')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Textarea
                            description={t('subscription-tabs.widget.announce-description')}
                            key={form.key('happAnnounce')}
                            label="Announce"
                            leftSection={<TemplateInfoPopoverShared showHostDescription={false} />}
                            minRows={4}
                            placeholder={t(
                                'subscription-tabs.widget.enter-announce-text-max-200-characters'
                            )}
                            size="sm"
                            style={{
                                placeContent: 'center'
                            }}
                            {...form.getInputProps('happAnnounce')}
                        />

                        <Textarea
                            description={t('subscription-settings.widget.happ-routing-description')}
                            key={form.key('happRouting')}
                            label={t('subscription-settings.widget.happ-routing')}
                            minRows={4}
                            placeholder="happ://routing/add/..."
                            size="sm"
                            {...form.getInputProps('happRouting')}
                        />
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button
                            color="grape"
                            leftSection={<PiGear size={px('1.2rem')} />}
                            onClick={() => {
                                window.open(
                                    'https://routing.happ.su',
                                    '_blank',
                                    'noopener noreferrer'
                                )
                            }}
                            size="md"
                            variant="light"
                            w="fit-content"
                        >
                            {t('subscription-settings.widget.configure-happ-routing')}
                        </Button>
                        <Button color="teal" loading={isPending} size="md" type="submit">
                            {t('common.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
