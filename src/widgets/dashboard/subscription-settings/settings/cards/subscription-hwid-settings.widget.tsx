import { Button, Group, NumberInput, px, Stack, Switch, Text, Textarea } from '@mantine/core'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { PiGear, PiIdentificationBadge } from 'react-icons/pi'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { TbDevices2 } from 'react-icons/tb'
import { useForm } from '@mantine/form'
import { Link } from 'react-router-dom'

import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

export const SubscriptionHwidSettingsWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'subscription-hwid-settings-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateSubscriptionSettingsCommand.RequestSchema),
        initialValues: {
            uuid: subscriptionSettings.uuid,
            hwidSettings: subscriptionSettings.hwidSettings!
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
                hwidSettings: values.hwidSettings
            }
        })
    })

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container>
                <SettingsCardShared.Header
                    description={t('subscription-hwid-settings.widget.hwid-card-description')}
                    icon={<PiIdentificationBadge size={24} />}
                    title={t('subscription-hwid-settings.widget.hwid-settings')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="xs" justify="start" wrap="nowrap">
                                <Text fw={600} size="md">
                                    {t('subscription-hwid-settings.widget.hwid-limit')}
                                </Text>
                            </Group>
                            <Switch
                                key={form.key('hwidSettings.enabled')}
                                size="md"
                                {...form.getInputProps('hwidSettings.enabled', {
                                    type: 'checkbox'
                                })}
                            />
                        </Group>

                        <NumberInput
                            description={t(
                                'subscription-hwid-settings.widget.fallback-device-limit-description'
                            )}
                            key={form.key('hwidSettings.fallbackDeviceLimit')}
                            label={t('subscription-hwid-settings.widget.fallback-device-limit')}
                            leftSection={<TbDevices2 size="16px" />}
                            max={9999}
                            min={0}
                            placeholder="999"
                            size="sm"
                            {...form.getInputProps('hwidSettings.fallbackDeviceLimit')}
                        />

                        <Textarea
                            description={t(
                                'subscription-hwid-settings.widget.max-devices-announce-description'
                            )}
                            key={form.key('hwidSettings.maxDevicesAnnounce')}
                            label={t('subscription-hwid-settings.widget.max-devices-announce')}
                            leftSection={<TemplateInfoPopoverShared showHostDescription={false} />}
                            maxLength={200}
                            minRows={4}
                            placeholder={t('subscription-hwid-settings.widget.max-200-characters')}
                            size="sm"
                            style={{
                                placeContent: 'center'
                            }}
                            {...form.getInputProps('hwidSettings.maxDevicesAnnounce')}
                        />
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button
                            color="grape"
                            component={Link}
                            leftSection={<PiGear size={px('1.2rem')} />}
                            size="md"
                            target="_blank,noopener noreferrer"
                            to="https://docs.rw/docs/features/hwid-device-limit"
                            variant="light"
                            w="fit-content"
                        >
                            {t('subscription-hwid-settings.widget.documentation')}
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
