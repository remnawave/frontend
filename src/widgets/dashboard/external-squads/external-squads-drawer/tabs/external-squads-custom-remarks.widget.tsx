import { TbCirclesRelation, TbDeviceFloppy, TbDevices2, TbListLetters, TbX } from 'react-icons/tb'
import { PiClockCountdown, PiClockUser, PiListChecks, PiProhibit } from 'react-icons/pi'
import { Button, Group, Paper, Stack, Switch, Text, Transition } from '@mantine/core'
import { GetExternalSquadByUuidCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'

import { QueryKeys, useUpdateExternalSquad } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import { RemarksManager } from '../../../subscription-settings/settings/cards/managers/remarks-manager.widget'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

const DEFAULT_REMARKS = {
    expired: ['⌛ Subscription expired', 'Contact support'],
    limited: ['🚧 Subscription limited', 'Contact support'],
    disabled: ['🚫 Subscription disabled', 'Contact support'],
    emptyHosts: ['🚫 No hosts found'],
    emptyInternalSquads: ['🚫 No internal squads found'],
    HWIDMaxDevicesExceeded: ['🚫 HWID: Max Devices Exceeded'],
    HWIDNotSupported: ['🚫 HWID: Not Supported']
}

export const ExternalSquadsCustomRemarksTabWidget = (props: IProps) => {
    const { externalSquad, isOpen } = props
    const { t } = useTranslation()

    const [isOverrideEnabled, setIsOverrideEnabled] = useState<boolean>(false)
    const [remarks, setRemarks] = useState<Record<string, string[]>>({
        expired: DEFAULT_REMARKS.expired,
        limited: DEFAULT_REMARKS.limited,
        disabled: DEFAULT_REMARKS.disabled,
        emptyHosts: DEFAULT_REMARKS.emptyHosts,
        emptyInternalSquads: DEFAULT_REMARKS.emptyInternalSquads,
        HWIDMaxDevicesExceeded: DEFAULT_REMARKS.HWIDMaxDevicesExceeded,
        HWIDNotSupported: DEFAULT_REMARKS.HWIDNotSupported
    })

    useEffect(() => {
        if (isOpen && externalSquad) {
            const currentRemarks = externalSquad.customRemarks
            if (currentRemarks) {
                setIsOverrideEnabled(true)

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
                    expired: processRemarks(currentRemarks.expiredUsers),
                    limited: processRemarks(currentRemarks.limitedUsers),
                    disabled: processRemarks(currentRemarks.disabledUsers),
                    emptyHosts: processRemarks(currentRemarks.emptyHosts),
                    emptyInternalSquads: processRemarks(currentRemarks.emptyInternalSquads),
                    HWIDMaxDevicesExceeded: processRemarks(currentRemarks.HWIDMaxDevicesExceeded),
                    HWIDNotSupported: processRemarks(currentRemarks.HWIDNotSupported)
                })
            } else {
                setIsOverrideEnabled(false)
                setRemarks({
                    expired: DEFAULT_REMARKS.expired,
                    limited: DEFAULT_REMARKS.limited,
                    disabled: DEFAULT_REMARKS.disabled,
                    emptyHosts: DEFAULT_REMARKS.emptyHosts,
                    emptyInternalSquads: DEFAULT_REMARKS.emptyInternalSquads,
                    HWIDMaxDevicesExceeded: DEFAULT_REMARKS.HWIDMaxDevicesExceeded,
                    HWIDNotSupported: DEFAULT_REMARKS.HWIDNotSupported
                })
            }
        }
    }, [isOpen, externalSquad])

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
    const { mutate: updateExternalSquad, isPending: isUpdatingExternalSquad } =
        useUpdateExternalSquad({
            mutationFns: {
                onSuccess: (data) => {
                    if (data) {
                        queryClient.setQueryData(
                            QueryKeys.externalSquads.getExternalSquad({
                                uuid: data.uuid
                            }).queryKey,
                            data
                        )
                    }
                }
            }
        })

    const handleUpdateExternalSquad = () => {
        if (!externalSquad?.uuid) return

        if (!isOverrideEnabled) {
            updateExternalSquad({
                variables: {
                    uuid: externalSquad.uuid,
                    customRemarks: null
                }
            })
            return
        }

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

        updateExternalSquad({
            variables: {
                uuid: externalSquad.uuid,
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
    }

    const handleToggleOverride = (checked: boolean) => {
        setIsOverrideEnabled(checked)
    }

    return (
        <Paper bg="dark.6" p="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Group align="center" justify="space-between" wrap="nowrap">
                    <Stack gap={4}>
                        <Group gap="xs">
                            <TbListLetters size={20} />
                            <Text fw={600} size="md">
                                {t('subscription-settings.widget.custom-remarks')}
                            </Text>
                        </Group>
                        <Text c="dimmed" size="sm">
                            {t(
                                'external-squads-custom-remarks.widget.override-remarks-description'
                            )}
                        </Text>
                    </Stack>
                </Group>

                <Paper bg="dark.7" p="md" withBorder>
                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="xs" justify="start" wrap="nowrap">
                            <Text fw={500} size="sm">
                                {t('external-squads-custom-remarks.widget.enable-override')}
                            </Text>
                        </Group>
                        <Switch
                            checked={isOverrideEnabled}
                            onChange={(e) => handleToggleOverride(e.currentTarget.checked)}
                            size="md"
                        />
                    </Group>
                </Paper>

                <Transition
                    duration={200}
                    mounted={isOverrideEnabled}
                    timingFunction="linear"
                    transition="fade"
                >
                    {(styles) => (
                        <Stack gap="md" style={styles}>
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
                        </Stack>
                    )}
                </Transition>

                <Button
                    color="teal"
                    fullWidth
                    leftSection={<TbDeviceFloppy size="1.2rem" />}
                    loading={isUpdatingExternalSquad}
                    onClick={handleUpdateExternalSquad}
                    size="md"
                    style={{
                        transition: 'all 0.2s ease'
                    }}
                    variant="light"
                >
                    {t('common.save')}
                </Button>
            </Stack>
        </Paper>
    )
}
