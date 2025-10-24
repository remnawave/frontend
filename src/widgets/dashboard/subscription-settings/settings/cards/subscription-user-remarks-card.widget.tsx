import { PiChatsCircle, PiClockCountdown, PiClockUser, PiProhibit } from 'react-icons/pi'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { Button, Card, Group, Stack } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useForm } from '@mantine/form'

import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

import { RemarksManager } from './managers/remarks-manager.widget'

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

export const SubscriptionUserRemarksCardWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const [remarks, setRemarks] = useState<Record<string, string[]>>({
        expired: [''],
        limited: [''],
        disabled: ['']
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

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'subscription-user-remarks-card-form',
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

        mutate({
            variables: {
                uuid: values.uuid,
                expiredUsersRemarks: expiredFiltered,
                limitedUsersRemarks: limitedFiltered,
                disabledUsersRemarks: disabledFiltered
            }
        })
    })

    useEffect(() => {
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
    }, [subscriptionSettings])

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container maw="1500px">
                <SettingsCardShared.Header
                    description={
                        <>
                            {t('subscription-settings.widget.user-status-remarks-description')}
                            <br />
                            {t(
                                'subscription-settings.widget.user-status-remarks-description-line-2'
                            )}
                            <br />
                            {t(
                                'subscription-settings.widget.user-status-remarks-description-line-3'
                            )}
                        </>
                    }
                    icon={<PiChatsCircle size={24} />}
                    title={t('subscription-settings.widget.user-status-remarks')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Card.Section p="lg" withBorder>
                            <Stack>
                                <RemarksManager
                                    icon={<PiClockUser size="16px" />}
                                    iconColor="red"
                                    initialRemarks={remarks.expired}
                                    onChange={updateExpiredRemarks}
                                    title={t('subscription-settings.widget.expired-users-remarks')}
                                />

                                <RemarksManager
                                    icon={<PiClockCountdown size="16px" />}
                                    iconColor="orange"
                                    initialRemarks={remarks.limited}
                                    onChange={updateLimitedRemarks}
                                    title={t('subscription-settings.widget.limited-users-remarks')}
                                />

                                <RemarksManager
                                    icon={<PiProhibit size="16px" />}
                                    iconColor="gray"
                                    initialRemarks={remarks.disabled}
                                    onChange={updateDisabledRemarks}
                                    title={t('subscription-settings.widget.disabled-users-remarks')}
                                />
                            </Stack>
                        </Card.Section>
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
