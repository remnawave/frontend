import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { handleFormErrors } from '@shared/utils/misc'

import { SubscriptionTabs } from './subscription-tabs.widget'
import { HeaderItem } from './headers-manager.widget'
import { IProps } from './interfaces'

export const SubscriptionSettingsWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const [remarks, setRemarks] = useState<Record<string, string[]>>({
        expired: [''],
        limited: [''],
        disabled: ['']
    })

    const [headers, setHeaders] = useState<HeaderItem[]>([])

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

    const updateHeaders = useCallback((newHeaders: HeaderItem[]) => {
        setHeaders(newHeaders)
    }, [])

    const { mutate: updateSubscriptionSettings, isPending: isUpdateSubscriptionSettingsPending } =
        useUpdateSubscriptionSettings({
            mutationFns: {
                onError(error) {
                    handleFormErrors(form, error)
                }
            }
        })

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

            if (
                subscriptionSettings.customResponseHeaders &&
                typeof subscriptionSettings.customResponseHeaders === 'object' &&
                subscriptionSettings.customResponseHeaders !== null
            ) {
                const headerItems = Object.entries(subscriptionSettings.customResponseHeaders).map(
                    ([key, value]) => ({ key, value })
                )
                setHeaders(headerItems)
            } else {
                setHeaders([])
            }

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
                addUsernameToBaseSubscription: subscriptionSettings.addUsernameToBaseSubscription,
                isShowCustomRemarks: subscriptionSettings.isShowCustomRemarks,
                customResponseHeaders: subscriptionSettings.customResponseHeaders || undefined,
                randomizeHosts: subscriptionSettings.randomizeHosts
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

        const headersFiltered = headers.filter((header) => header.key.trim() !== '')

        const customResponseHeaders: Record<string, string> = {}
        headersFiltered.forEach((header) => {
            customResponseHeaders[header.key] = header.value
        })

        const isProfileWebpageUrlEnabled =
            (values.isProfileWebpageUrlEnabled as unknown as string) === 'true'

        updateSubscriptionSettings({
            variables: {
                ...values,
                uuid: values.uuid,
                isProfileWebpageUrlEnabled,
                expiredUsersRemarks: expiredFiltered,
                limitedUsersRemarks: limitedFiltered,
                disabledUsersRemarks: disabledFiltered,
                customResponseHeaders
            }
        })
    })

    return (
        <SubscriptionTabs
            form={form}
            handleSubmit={handleSubmit}
            headers={headers}
            isUpdateSubscriptionSettingsPending={isUpdateSubscriptionSettingsPending}
            remarks={remarks}
            updateDisabledRemarks={updateDisabledRemarks}
            updateExpiredRemarks={updateExpiredRemarks}
            updateHeaders={updateHeaders}
            updateLimitedRemarks={updateLimitedRemarks}
        />
    )
}
