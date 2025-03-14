import {
    Box,
    Button,
    Checkbox,
    Grid,
    Group,
    NumberInput,
    Paper,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title
} from '@mantine/core'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { PiFloppyDisk, PiGear } from 'react-icons/pi'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'

import { RemarksManager } from './remarks-manager.widget'
import { IProps } from './interfaces'

export const SubscriptionSettingsWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [remarks, setRemarks] = useState<Record<string, string[]>>({
        expired: [''],
        limited: [''],
        disabled: ['']
    })

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'edit-subscription-settings-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            UpdateSubscriptionSettingsCommand.RequestSchema.omit({
                isProfileWebpageUrlEnabled: true
            })
        )
    })

    const updateExpiredRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, expired: newRemarks }))
    }, [])

    const updateLimitedRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, limited: newRemarks }))
    }, [])

    const updateDisabledRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, disabled: newRemarks }))
    }, [])

    const { mutate: updateSubscriptionSettings, isPending: isUpdateSubscriptionSettingsPending } =
        useUpdateSubscriptionSettings({})
    useEffect(() => {
        if (subscriptionSettings) {
            const processRemarks = (remarksData: string | string[] | undefined): string[] => {
                if (!remarksData) return ['']

                if (typeof remarksData === 'string') {
                    return remarksData.split('\n').filter(Boolean).length > 0
                        ? remarksData.split('\n').filter(Boolean)
                        : ['']
                }

                return Array.isArray(remarksData) && remarksData.length > 0 ? remarksData : ['']
            }

            setRemarks({
                expired: processRemarks(subscriptionSettings.expiredUsersRemarks),
                limited: processRemarks(subscriptionSettings.limitedUsersRemarks),
                disabled: processRemarks(subscriptionSettings.disabledUsersRemarks)
            })

            form.setValues({
                uuid: subscriptionSettings.uuid,
                profileTitle: subscriptionSettings.profileTitle,
                supportLink: subscriptionSettings.supportLink,
                profileUpdateInterval: subscriptionSettings.profileUpdateInterval,
                happAnnounce: subscriptionSettings.happAnnounce,
                happRouting: subscriptionSettings.happRouting,

                // @ts-expect-error - TODO: fix this
                isProfileWebpageUrlEnabled: subscriptionSettings.isProfileWebpageUrlEnabled
                    ? 'true'
                    : 'false',

                expiredUsersRemarks: subscriptionSettings.expiredUsersRemarks,
                limitedUsersRemarks: subscriptionSettings.limitedUsersRemarks,
                disabledUsersRemarks: subscriptionSettings.disabledUsersRemarks,
                serveJsonAtBaseSubscription: subscriptionSettings.serveJsonAtBaseSubscription,
                addUsernameToBaseSubscription: subscriptionSettings.addUsernameToBaseSubscription
            })
        }
    }, [subscriptionSettings])

    const handleSubmit = form.onSubmit((values) => {
        const filterEmptyStrings = (arr: string[]): string[] => {
            const filtered = arr.filter((item) => item.trim() !== '')
            return filtered.length > 0 ? filtered : ['']
        }

        const expiredFiltered = filterEmptyStrings(remarks.expired)
        const limitedFiltered = filterEmptyStrings(remarks.limited)
        const disabledFiltered = filterEmptyStrings(remarks.disabled)

        if (expiredFiltered[0] === '' || limitedFiltered[0] === '' || disabledFiltered[0] === '') {
            notifications.show({
                color: 'red',
                title: t('subscription-settings.widget.validation-error'),
                message: t(
                    'subscription-settings.widget.you-must-add-at-least-one-remark-with-text'
                )
            })
            return
        }

        const isProfileWebpageUrlEnabled =
            (values.isProfileWebpageUrlEnabled as unknown as string) === 'true'

        updateSubscriptionSettings({
            variables: {
                ...values,
                uuid: values.uuid,
                isProfileWebpageUrlEnabled,
                expiredUsersRemarks: expiredFiltered,
                limitedUsersRemarks: limitedFiltered,
                disabledUsersRemarks: disabledFiltered
            }
        })
    })

    return (
        <form key="subscription-settings-form" onSubmit={handleSubmit}>
            <Stack gap="md">
                <Paper p="md" withBorder>
                    <Stack>
                        <Title order={3}>
                            {t('subscription-settings.widget.subscription-info')}
                        </Title>

                        <Grid>
                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                <TextInput
                                    description={t(
                                        'subscription-settings.widget.this-title-will-be-displayed-as-subscription-name'
                                    )}
                                    key={form.key('profileTitle')}
                                    label={t('subscription-settings.widget.profile-title')}
                                    placeholder={t(
                                        'subscription-settings.widget.enter-profile-title'
                                    )}
                                    {...form.getInputProps('profileTitle')}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                <NumberInput
                                    description={t(
                                        'subscription-settings.widget.auto-update-description'
                                    )}
                                    key={form.key('profileUpdateInterval')}
                                    label={t(
                                        'subscription-settings.widget.auto-update-interval-hours'
                                    )}
                                    min={1}
                                    placeholder="60"
                                    {...form.getInputProps('profileUpdateInterval')}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                <TextInput
                                    description={t(
                                        'subscription-settings.widget.support-link-description'
                                    )}
                                    key={form.key('supportLink')}
                                    label={t('subscription-settings.widget.support-link')}
                                    placeholder="https://support.example.com"
                                    {...form.getInputProps('supportLink')}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                <Select
                                    allowDeselect={false}
                                    comboboxProps={{
                                        transitionProps: { transition: 'pop', duration: 200 }
                                    }}
                                    data={[
                                        {
                                            label: t('subscription-settings.widget.enabled'),
                                            value: 'true'
                                        },
                                        {
                                            label: t('subscription-settings.widget.disabled'),
                                            value: 'false'
                                        }
                                    ]}
                                    description={t(
                                        'subscription-settings.widget.profile-webpage-url-description'
                                    )}
                                    key={form.key('isProfileWebpageUrlEnabled')}
                                    label={t('subscription-settings.widget.profile-webpage-url')}
                                    {...form.getInputProps('isProfileWebpageUrlEnabled')}
                                />
                            </Grid.Col>

                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                <Box mb="md">
                                    <Checkbox
                                        key={form.key('serveJsonAtBaseSubscription')}
                                        label={t(
                                            'subscription-settings.widget.serve-json-at-base-subscription'
                                        )}
                                        {...form.getInputProps('serveJsonAtBaseSubscription', {
                                            type: 'checkbox'
                                        })}
                                    />
                                    <Text c="dimmed" component="div" ml={30} size="sm">
                                        {t('subscription-settings.widget.serve-json-description')}
                                    </Text>
                                </Box>
                            </Grid.Col>

                            <Grid.Col span={{ xs: 12, sm: 6 }}>
                                <Box>
                                    <Checkbox
                                        key={form.key('addUsernameToBaseSubscription')}
                                        label={t(
                                            'subscription-settings.widget.add-username-to-base-subscription'
                                        )}
                                        {...form.getInputProps('addUsernameToBaseSubscription', {
                                            type: 'checkbox'
                                        })}
                                    />
                                    <Text c="dimmed" component="div" ml={30} size="sm">
                                        {t('subscription-settings.widget.add-username-description')}
                                    </Text>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>

                <Paper p="md" withBorder>
                    <Stack gap="md">
                        <Title order={3}>{t('subscription-settings.widget.happ-settings')}</Title>

                        <Textarea
                            description={t(
                                'subscription-settings.widget.happ-announce-description'
                            )}
                            key={form.key('happAnnounce')}
                            label={t('subscription-settings.widget.happ-announce')}
                            minRows={4}
                            placeholder={t(
                                'subscription-settings.widget.enter-happ-announce-max-200-characters'
                            )}
                            {...form.getInputProps('happAnnounce')}
                        />

                        <Textarea
                            description={
                                <>
                                    {t('subscription-settings.widget.happ-routing-description')}{' '}
                                    <br />
                                    {t(
                                        'subscription-settings.widget.happ-routing-description-line-2'
                                    )}
                                    <br />
                                    <Button
                                        color="grape"
                                        leftSection={<PiGear size="1.2rem" />}
                                        mb="md"
                                        mt={'md'}
                                        onClick={() => {
                                            navigate(ROUTES.DASHBOARD.UTILS.HAPP_ROUTING_BUILDER)
                                        }}
                                        size="xs"
                                        variant="outline"
                                        w="fit-content"
                                    >
                                        {t('subscription-settings.widget.configure-happ-routing')}
                                    </Button>
                                </>
                            }
                            key={form.key('happRouting')}
                            label={t('subscription-settings.widget.happ-routing')}
                            minRows={4}
                            placeholder="happ://routing/add/..."
                            {...form.getInputProps('happRouting')}
                        />
                    </Stack>
                </Paper>

                <Paper p="md" withBorder>
                    <Stack>
                        <Title order={3}>
                            {t('subscription-settings.widget.user-status-remarks')}
                        </Title>

                        <Text c="dimmed" component="div" size="sm">
                            {t('subscription-settings.widget.user-status-remarks-description')}{' '}
                            <br />
                            {t(
                                'subscription-settings.widget.user-status-remarks-description-line-2'
                            )}{' '}
                            <br />
                            {t(
                                'subscription-settings.widget.user-status-remarks-description-line-3'
                            )}
                        </Text>

                        <RemarksManager
                            initialRemarks={remarks.expired}
                            onChange={updateExpiredRemarks}
                            title={t('subscription-settings.widget.expired-users-remarks')}
                        />

                        <RemarksManager
                            initialRemarks={remarks.limited}
                            onChange={updateLimitedRemarks}
                            title={t('subscription-settings.widget.limited-users-remarks')}
                        />

                        <RemarksManager
                            initialRemarks={remarks.disabled}
                            onChange={updateDisabledRemarks}
                            title={t('subscription-settings.widget.disabled-users-remarks')}
                        />
                    </Stack>
                </Paper>

                <Group justify="flex-start" mt="xs">
                    <Button
                        color="blue"
                        leftSection={<PiFloppyDisk size="1.2rem" />}
                        loading={isUpdateSubscriptionSettingsPending}
                        size="md"
                        type="submit"
                    >
                        {t('subscription-settings.widget.update-settings')}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
