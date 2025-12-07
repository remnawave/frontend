import { PiClockCountdown, PiClockUser, PiListChecks, PiProhibit } from 'react-icons/pi'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { TbCirclesRelation, TbListLetters } from 'react-icons/tb'
import { Button, Card, Grid, Group, Stack } from '@mantine/core'
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
        disabled: [''],
        emptyHosts: [''],
        emptyInternalSquads: ['']
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

    const updateEmptyHostsRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, emptyHosts: newRemarks }))
    }, [])

    const updateEmptyInternalSquadsRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, emptyInternalSquads: newRemarks }))
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
        const emptyHostsFiltered = filterEmptyStrings(remarks.emptyHosts)
        const emptyInternalSquadsFiltered = filterEmptyStrings(remarks.emptyInternalSquads)

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
                customRemarks: {
                    expiredUsers: expiredFiltered,
                    limitedUsers: limitedFiltered,
                    disabledUsers: disabledFiltered,
                    emptyHosts: emptyHostsFiltered,
                    emptyInternalSquads: emptyInternalSquadsFiltered
                }
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
            expired: processRemarks(subscriptionSettings.customRemarks.expiredUsers),
            limited: processRemarks(subscriptionSettings.customRemarks.limitedUsers),
            disabled: processRemarks(subscriptionSettings.customRemarks.disabledUsers),
            emptyHosts: processRemarks(subscriptionSettings.customRemarks.emptyHosts),
            emptyInternalSquads: processRemarks(
                subscriptionSettings.customRemarks.emptyInternalSquads
            )
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
                    icon={<TbListLetters size={24} />}
                    title={t('subscription-settings.widget.custom-remarks')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Card.Section p="lg" withBorder>
                            <Grid
                                breakpoints={{
                                    xs: '480px',
                                    sm: '640px',
                                    md: '768px',
                                    lg: '960px',
                                    xl: '1280px'
                                }}
                                type="container"
                            >
                                <Grid.Col
                                    span={{
                                        base: 12,
                                        md: 6
                                    }}
                                >
                                    <RemarksManager
                                        icon={<PiClockUser size="24px" />}
                                        iconColor="red"
                                        initialRemarks={remarks.expired}
                                        onChange={updateExpiredRemarks}
                                        title={`${t('subscription-user-remarks-card.widget.user-status')}: EXPIRED`}
                                    />
                                </Grid.Col>

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        md: 6
                                    }}
                                >
                                    <RemarksManager
                                        icon={<PiClockCountdown size="24px" />}
                                        iconColor="orange"
                                        initialRemarks={remarks.limited}
                                        onChange={updateLimitedRemarks}
                                        title={`${t('subscription-user-remarks-card.widget.user-status')}: LIMITED`}
                                    />
                                </Grid.Col>

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        md: 6
                                    }}
                                >
                                    <RemarksManager
                                        icon={<PiProhibit size="24px" />}
                                        iconColor="gray"
                                        initialRemarks={remarks.disabled}
                                        onChange={updateDisabledRemarks}
                                        title={`${t('subscription-user-remarks-card.widget.user-status')}: DISABLED`}
                                    />
                                </Grid.Col>

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        md: 6
                                    }}
                                >
                                    <RemarksManager
                                        icon={<PiListChecks size="24px" />}
                                        iconColor="blue"
                                        initialRemarks={remarks.emptyHosts}
                                        onChange={updateEmptyHostsRemarks}
                                        title={t(
                                            'subscription-user-remarks-card.widget.empty-hosts'
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col
                                    span={{
                                        base: 12,
                                        md: 6
                                    }}
                                >
                                    <RemarksManager
                                        icon={<TbCirclesRelation size="24px" />}
                                        iconColor="green"
                                        initialRemarks={remarks.emptyInternalSquads}
                                        onChange={updateEmptyInternalSquadsRemarks}
                                        title={t(
                                            'subscription-user-remarks-card.widget.empty-internal-squads'
                                        )}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Card.Section>
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
