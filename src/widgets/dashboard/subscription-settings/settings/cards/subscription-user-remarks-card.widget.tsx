import { CodeHighlight } from '@mantine/code-highlight'
import { Button, Card, Group, Stack } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiClockCountdown, PiClockUser, PiListChecks, PiProhibit } from 'react-icons/pi'
import { TbDevices2, TbListLetters, TbX } from 'react-icons/tb'
import Masonry from 'react-layout-masonry'

import { queryClient } from '@shared/api'
import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'

import { RemarksManager } from './managers/remarks-manager.widget'
import { computeRemarks } from './subscription-user-remarks.utils'

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

export const SubscriptionUserRemarksCardWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const [remarks, setRemarks] = useState(() => computeRemarks(subscriptionSettings))

    const [prevSettings, setPrevSettings] = useState(subscriptionSettings)
    if (subscriptionSettings !== prevSettings) {
        setPrevSettings(subscriptionSettings)
        setRemarks(computeRemarks(subscriptionSettings))
    }

    const updateExpiredRemarks = (newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, expired: newRemarks }))
    }

    const updateLimitedRemarks = (newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, limited: newRemarks }))
    }

    const updateDisabledRemarks = (newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, disabled: newRemarks }))
    }

    const updateEmptyHostsRemarks = (newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, emptyHosts: newRemarks }))
    }

    const updateHWIDMaxDevicesExceededRemarks = (newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, HWIDMaxDevicesExceeded: newRemarks }))
    }

    const updateHWIDNotSupportedRemarks = (newRemarks: string[]) => {
        setRemarks((prev) => ({ ...prev, HWIDNotSupported: newRemarks }))
    }

    const form = useForm<UpdateSubscriptionSettingsCommand.RequestBody>({
        name: 'subscription-user-remarks-card-form',
        mode: 'uncontrolled',
        validate: schemaResolver(UpdateSubscriptionSettingsCommand.RequestBodySchema),
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

                setRemarks(computeRemarks(data))
            },

            onError(error) {
                if ((error.cause as unknown as { errorCode: string })?.errorCode === 'A231') {
                    modals.open({
                        centered: true,
                        size: 'auto',
                        title: (
                            <BaseOverlayHeader
                                iconColor="red"
                                IconComponent={TbX}
                                iconVariant="soft"
                                title={t('subscription-settings.widget.validation-error')}
                            />
                        ),
                        children: <CodeHighlight language="json" code={error.message} />
                    })

                    return
                }

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
        const HWIDMaxDevicesExceededFiltered = filterEmptyStrings(remarks.HWIDMaxDevicesExceeded)
        const HWIDNotSupportedFiltered = filterEmptyStrings(remarks.HWIDNotSupported)

        if (
            expiredFiltered[0] === '' ||
            limitedFiltered[0] === '' ||
            disabledFiltered[0] === '' ||
            HWIDMaxDevicesExceededFiltered[0] === '' ||
            HWIDNotSupportedFiltered[0] === '' ||
            emptyHostsFiltered[0] === ''
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
                    HWIDMaxDevicesExceeded: HWIDMaxDevicesExceededFiltered,
                    HWIDNotSupported: HWIDNotSupportedFiltered
                }
            }
        })
    })

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
                    iconColor="cyan"
                    iconVariant="soft"
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
                                    title={`${t('common.field.user-status')}: EXPIRED`}
                                />

                                <RemarksManager
                                    icon={<PiClockCountdown size="24px" />}
                                    iconColor="orange"
                                    initialRemarks={remarks.limited}
                                    onChange={updateLimitedRemarks}
                                    title={`${t('common.field.user-status')}: LIMITED`}
                                />

                                <RemarksManager
                                    icon={<PiProhibit size="24px" />}
                                    iconColor="gray"
                                    initialRemarks={remarks.disabled}
                                    onChange={updateDisabledRemarks}
                                    title={`${t('common.field.user-status')}: DISABLED`}
                                />

                                <RemarksManager
                                    icon={<PiListChecks size="24px" />}
                                    iconColor="blue"
                                    initialRemarks={remarks.emptyHosts}
                                    onChange={updateEmptyHostsRemarks}
                                    title={t('subscription-user-remarks-card.widget.empty-hosts')}
                                />
                            </Masonry>
                        </Card.Section>
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button
                            color="teal"
                            loading={isPending}
                            size="md"
                            type="submit"
                            variant="soft"
                        >
                            {t('common.action.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
