import {
    Box,
    Button,
    Group,
    NumberInput,
    Paper,
    Stack,
    Switch,
    Text,
    Textarea,
    Transition
} from '@mantine/core'
import {
    GetExternalSquadByUuidCommand,
    HwidSettingsSchema,
    THwidSettings
} from '@remnawave/backend-contract'
import { TbDeviceFloppy, TbDevices2 } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { QueryKeys, useUpdateExternalSquad } from '@shared/api/hooks'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers'
import { queryClient } from '@shared/api'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

export const ExternalSquadsHwidSettingsTabWidget = (props: IProps) => {
    const { externalSquad, isOpen } = props
    const { t } = useTranslation()

    const [isOverrideEnabled, setIsOverrideEnabled] = useState<boolean>(false)
    const [hwidSettings, setHwidSettings] = useState<THwidSettings>({
        enabled: false,
        fallbackDeviceLimit: 999,
        maxDevicesAnnounce: null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (isOpen && externalSquad) {
            const currentSettings = externalSquad.hwidSettings
            if (currentSettings) {
                setIsOverrideEnabled(true)
                setHwidSettings({
                    enabled: currentSettings.enabled ?? false,
                    fallbackDeviceLimit: currentSettings.fallbackDeviceLimit ?? 0,
                    maxDevicesAnnounce: currentSettings.maxDevicesAnnounce ?? null
                })
            } else {
                setIsOverrideEnabled(false)
                setHwidSettings({
                    enabled: false,
                    fallbackDeviceLimit: 999,
                    maxDevicesAnnounce: null
                })
            }
            setErrors({})
        }
    }, [isOpen, externalSquad])

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

    const validateHwidSettings = (): boolean => {
        if (!isOverrideEnabled) {
            setErrors({})
            return true
        }

        const validatetionResult = HwidSettingsSchema.safeParse(hwidSettings)
        if (!validatetionResult.success) {
            const newErrors: Record<string, string> = {}
            validatetionResult.error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    const fieldName = err.path[0] as string
                    newErrors[fieldName] = err.message
                }
            })
            setErrors(newErrors)
            return false
        }
        setErrors({})
        return true
    }

    const handleUpdateExternalSquad = () => {
        if (!externalSquad) return

        if (!validateHwidSettings()) {
            return
        }

        updateExternalSquad({
            variables: {
                uuid: externalSquad.uuid,
                hwidSettings: isOverrideEnabled ? hwidSettings : null
            }
        })
    }

    const handleToggleOverride = (checked: boolean) => {
        setIsOverrideEnabled(checked)
        setErrors({})
    }

    const handleUpdateField = (
        field: keyof typeof HwidSettingsSchema.shape,
        value: boolean | null | number | string
    ) => {
        setHwidSettings((prev) => ({
            ...prev,
            [field]: value
        }))
        setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
        })
    }

    return (
        <Paper bg="dark.6" p="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Group align="center" justify="space-between" wrap="nowrap">
                    <Stack gap={4}>
                        <Text fw={600} size="md">
                            {t('external-squads-hwid-settings.tab.widget.hwid-settings-override')}
                        </Text>
                        <Text c="dimmed" size="sm">
                            {t(
                                'external-squads-hwid-settings.tab.widget.override-hwid-description'
                            )}
                        </Text>
                    </Stack>
                </Group>

                <Paper bg="dark.7" p="md" withBorder>
                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="xs" justify="start" wrap="nowrap">
                            <Text fw={500} size="sm">
                                {t('external-squads-hwid-settings.tab.widget.enable-hwid-override')}
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
                            <Paper bg="dark.7" p="md" withBorder>
                                <Group justify="space-between" wrap="nowrap">
                                    <Group gap="xs" justify="start" wrap="nowrap">
                                        <Text fw={500} size="sm">
                                            {t('subscription-hwid-settings.widget.hwid-limit')}
                                        </Text>
                                    </Group>
                                    <Switch
                                        checked={hwidSettings.enabled}
                                        onChange={(e) =>
                                            handleUpdateField('enabled', e.currentTarget.checked)
                                        }
                                        size="md"
                                    />
                                </Group>
                            </Paper>

                            <Paper bg="dark.7" p="md" withBorder>
                                <Box style={{ flex: 1 }}>
                                    <NumberInput
                                        error={errors.fallbackDeviceLimit}
                                        label={
                                            <Group gap={4} justify="flex-start">
                                                <Text fw={600} size="sm">
                                                    {t(
                                                        'subscription-hwid-settings.widget.fallback-device-limit'
                                                    )}
                                                </Text>
                                            </Group>
                                        }
                                        leftSection={<TbDevices2 size="16px" />}
                                        max={9999}
                                        min={0}
                                        onChange={(val) =>
                                            handleUpdateField('fallbackDeviceLimit', Number(val))
                                        }
                                        placeholder="999"
                                        size="sm"
                                        value={hwidSettings.fallbackDeviceLimit}
                                    />
                                </Box>
                            </Paper>

                            <Paper bg="dark.7" p="md" withBorder>
                                <Box style={{ flex: 1 }}>
                                    <Textarea
                                        error={errors.maxDevicesAnnounce}
                                        label={t(
                                            'subscription-hwid-settings.widget.max-devices-announce'
                                        )}
                                        leftSection={
                                            <TemplateInfoPopoverShared
                                                showHostDescription={false}
                                            />
                                        }
                                        maxLength={200}
                                        minRows={3}
                                        onChange={(e) =>
                                            handleUpdateField(
                                                'maxDevicesAnnounce',
                                                e.currentTarget.value
                                            )
                                        }
                                        placeholder={t(
                                            'subscription-hwid-settings.widget.max-200-characters'
                                        )}
                                        size="sm"
                                        value={hwidSettings.maxDevicesAnnounce || ''}
                                    />
                                </Box>
                            </Paper>
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
