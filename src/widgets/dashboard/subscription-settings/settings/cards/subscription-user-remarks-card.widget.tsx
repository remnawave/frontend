import { PiClockCountdown, PiClockUser, PiListChecks, PiProhibit } from 'react-icons/pi'
import { TbCirclesRelation, TbDevices2, TbListLetters, TbX } from 'react-icons/tb'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { Button, Card, Group, Stack } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import Masonry from 'react-layout-masonry'
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
        emptyInternalSquads: [''],
        HWIDMaxDevicesExceeded: [''],
        HWIDNotSupported: ['']
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

    const updateHWIDMaxDevicesExceededRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, HWIDMaxDevicesExceeded: newRemarks }))
    }, [])

    const updateHWIDNotSupportedRemarks = useCallback((newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, HWIDNotSupported: newRemarks }))
    }, [])

    const form = useForm<UpdateSubscriptionSettingsCommand.Request>({
        name: 'subscription-user-remarks-card-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateSubscriptionSettingsCommand.RequestSchema),
        initialValues: {
            uuid: subscriptionSettings.uuid
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
        const HWIDMaxDevicesExceededFiltered = filterEmptyStrings(remarks.HWIDMaxDevicesExceeded)
        const HWIDNotSupportedFiltered = filterEmptyStrings(remarks.HWIDNotSupported)

        if (
            expiredFiltered[0] === '' ||
            limitedFiltered[0] === '' ||
            disabledFiltered[0] === '' ||
            HWIDMaxDevicesExceededFiltered[0] === '' ||
            HWIDNotSupportedFiltered[0] === '' ||
            emptyHostsFiltered[0] === '' ||
            emptyInternalSquadsFiltered[0] === ''
        ) {
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
                    emptyInternalSquads: emptyInternalSquadsFiltered,
                    HWIDMaxDevicesExceeded: HWIDMaxDevicesExceededFiltered,
                    HWIDNotSupported: HWIDNotSupportedFiltered
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
            ),
            HWIDMaxDevicesExceeded: processRemarks(
                subscriptionSettings.customRemarks.HWIDMaxDevicesExceeded
            ),
            HWIDNotSupported: processRemarks(subscriptionSettings.customRemarks.HWIDNotSupported)
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
                        </>
                    }
                    icon={<TbListLetters size={24} />}
                    title={t('subscription-settings.widget.custom-remarks')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Card.Section p="lg" withBorder>
                            <Masonry columns={{ 300: 1, 1400: 2, 2000: 3, 3000: 4 }} gap={16}>
                                <RemarksManager
                                    icon={<TbDevices2 size="24px" />}
                                    iconColor="red"
                                    initialRemarks={remarks.HWIDMaxDevicesExceeded}
                                    onChange={updateHWIDMaxDevicesExceededRemarks}
                                    title={t(
                                        'subscription-user-remarks-card.widget.hwid-max-devices-exceeded'
                                    )}
                                />

                                <RemarksManager
                                    icon={<TbX size="24px" />}
                                    iconColor="red"
                                    initialRemarks={remarks.HWIDNotSupported}
                                    onChange={updateHWIDNotSupportedRemarks}
                                    title={t(
                                        'subscription-user-remarks-card.widget.hwid-not-supported'
                                    )}
                                />

                                <RemarksManager
                                    icon={<PiClockUser size="24px" />}
                                    iconColor="red"
                                    initialRemarks={remarks.expired}
                                    onChange={updateExpiredRemarks}
                                    title={`${t('subscription-user-remarks-card.widget.user-status')}: EXPIRED`}
                                />

                                <RemarksManager
                                    icon={<PiClockCountdown size="24px" />}
                                    iconColor="orange"
                                    initialRemarks={remarks.limited}
                                    onChange={updateLimitedRemarks}
                                    title={`${t('subscription-user-remarks-card.widget.user-status')}: LIMITED`}
                                />

                                <RemarksManager
                                    icon={<PiProhibit size="24px" />}
                                    iconColor="gray"
                                    initialRemarks={remarks.disabled}
                                    onChange={updateDisabledRemarks}
                                    title={`${t('subscription-user-remarks-card.widget.user-status')}: DISABLED`}
                                />

                                <RemarksManager
                                    icon={<PiListChecks size="24px" />}
                                    iconColor="blue"
                                    initialRemarks={remarks.emptyHosts}
                                    onChange={updateEmptyHostsRemarks}
                                    title={t('subscription-user-remarks-card.widget.empty-hosts')}
                                />

                                <RemarksManager
                                    icon={<TbCirclesRelation size="24px" />}
                                    iconColor="green"
                                    initialRemarks={remarks.emptyInternalSquads}
                                    onChange={updateEmptyInternalSquadsRemarks}
                                    title={t(
                                        'subscription-user-remarks-card.widget.empty-internal-squads'
                                    )}
                                />
                            </Masonry>
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
