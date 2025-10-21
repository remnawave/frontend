import {
    ActionIcon,
    Box,
    Button,
    Group,
    NumberInput,
    Paper,
    Select,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import {
    ExternalSquadSubscriptionSettingsSchema,
    GetExternalSquadByUuidCommand
} from '@remnawave/backend-contract'
import { useEffect, useMemo, useState } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import z from 'zod'

import { resolveSubscriptionSetting } from '@widgets/dashboard/subscription-settings/settings/resolve-settings'
import { QueryKeys, useUpdateExternalSquad } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

type SubscriptionSettingsOverride = z.infer<typeof ExternalSquadSubscriptionSettingsSchema>
type SubscriptionSettingField = keyof SubscriptionSettingsOverride

export const ExternalSquadsSettingsTabWidget = (props: IProps) => {
    const { externalSquad, isOpen } = props

    const { t } = useTranslation()

    const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettingsOverride>(
        {}
    )

    useEffect(() => {
        if (isOpen && externalSquad) {
            if (externalSquad.subscriptionSettings) {
                setSubscriptionSettings(externalSquad.subscriptionSettings)
            } else {
                setSubscriptionSettings({})
            }
        }
    }, [isOpen, externalSquad])

    const { mutate: updateExternalSquad, isPending: isUpdatingExternalSquad } =
        useUpdateExternalSquad({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.externalSquads.getExternalSquads.queryKey
                    })
                }
            }
        })

    const handleUpdateExternalSquad = () => {
        if (!externalSquad) return

        updateExternalSquad({
            variables: {
                subscriptionSettings,
                uuid: externalSquad.uuid
            }
        })
    }

    const handleAddSubscriptionSetting = (field: SubscriptionSettingField) => {
        setSubscriptionSettings((prev) => {
            const fieldConfig = resolveSubscriptionSetting(field, t)
            let defaultValue: boolean | null | number | string | undefined

            switch (fieldConfig.inputType) {
                case 'boolean':
                    defaultValue = false
                    break
                case 'number':
                    defaultValue = 1
                    break
                case 'string':
                case 'textarea':
                    defaultValue = ''
                    break
                default:
                    defaultValue = undefined
            }

            return {
                ...prev,
                [field]: defaultValue
            }
        })
    }

    const handleRemoveSubscriptionSetting = (field: SubscriptionSettingField) => {
        setSubscriptionSettings((prev) => {
            const newSettings = { ...prev }
            delete newSettings[field]
            return newSettings
        })
    }

    const handleUpdateSubscriptionSetting = (
        field: SubscriptionSettingField,
        value: boolean | null | number | string
    ) => {
        setSubscriptionSettings((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const availableSubscriptionFields = useMemo(() => {
        return Object.keys(ExternalSquadSubscriptionSettingsSchema.shape).filter(
            (field) => !(field in subscriptionSettings)
        )
    }, [subscriptionSettings])

    const renderSubscriptionSettingField = (field: SubscriptionSettingField) => {
        const fieldConfig = resolveSubscriptionSetting(field, t)
        if (!fieldConfig) return null

        const value = subscriptionSettings[field]
        const { inputType, label, hoverCard, leftSection, rightSection } = fieldConfig

        switch (inputType) {
            case 'boolean':
                return (
                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="xs" justify="start" wrap="nowrap">
                            {hoverCard}
                            <Text fw={500} size="sm">
                                {label}
                            </Text>
                        </Group>
                        <Switch
                            checked={Boolean(value)}
                            onChange={(e) =>
                                handleUpdateSubscriptionSetting(field, e.currentTarget.checked)
                            }
                            size="md"
                        />
                    </Group>
                )
            case 'number':
                return (
                    <NumberInput
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={600} size="sm">
                                    {label}
                                </Text>
                                {hoverCard}
                            </Group>
                        }
                        leftSection={leftSection}
                        min={1}
                        onChange={(val) => handleUpdateSubscriptionSetting(field, Number(val) || 1)}
                        rightSection={rightSection}
                        size="sm"
                        value={Number(value) || 1}
                    />
                )
            case 'string':
                return (
                    <TextInput
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={600} size="sm">
                                    {label}
                                </Text>
                                {hoverCard}
                            </Group>
                        }
                        leftSection={leftSection}
                        onChange={(e) =>
                            handleUpdateSubscriptionSetting(field, e.currentTarget.value)
                        }
                        rightSection={rightSection}
                        size="sm"
                        value={String(value || '')}
                    />
                )
            case 'textarea':
                return (
                    <Textarea
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={600} size="sm">
                                    {label}
                                </Text>
                                {hoverCard}
                            </Group>
                        }
                        leftSection={leftSection}
                        minRows={3}
                        onChange={(e) =>
                            handleUpdateSubscriptionSetting(field, e.currentTarget.value)
                        }
                        rightSection={rightSection}
                        size="sm"
                        value={String(value || '')}
                    />
                )
            default:
                return null
        }
    }

    return (
        <Paper bg="dark.6" p="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Text fw={600} size="md">
                    {t('subscription-settings.widget.subscription-info')}
                </Text>
                <Text c="dimmed" size="sm">
                    {t(
                        'external-squads-settings.tab.widget.override-subscription-settings-for-this-external-squad'
                    )}
                </Text>

                {Object.keys(subscriptionSettings).length > 0 && (
                    <Stack gap="md">
                        {(Object.keys(subscriptionSettings) as SubscriptionSettingField[]).map(
                            (field) => {
                                const fieldConfig = resolveSubscriptionSetting(field, t)
                                const { inputType } = fieldConfig
                                const isCheckbox = inputType === 'boolean'

                                return (
                                    <Paper bg="dark.7" key={field} p="md" withBorder>
                                        <Group align="center" gap="xs" wrap="nowrap">
                                            <Box style={{ flex: 1 }}>
                                                {renderSubscriptionSettingField(field)}
                                            </Box>
                                            <ActionIcon
                                                color="red"
                                                mt={!isCheckbox ? '1.5rem' : 0}
                                                onClick={() =>
                                                    handleRemoveSubscriptionSetting(field)
                                                }
                                                size="input-sm"
                                                variant="subtle"
                                            >
                                                <PiTrash size={20} />
                                            </ActionIcon>
                                        </Group>
                                    </Paper>
                                )
                            }
                        )}
                    </Stack>
                )}

                {availableSubscriptionFields.length > 0 && (
                    <Select
                        clearable
                        data={availableSubscriptionFields.map((field) => ({
                            label: resolveSubscriptionSetting(
                                field as unknown as SubscriptionSettingField,
                                t
                            ).label,
                            value: field
                        }))}
                        leftSection={<PiPlus size={16} />}
                        onChange={(value) => {
                            if (value) {
                                handleAddSubscriptionSetting(value as SubscriptionSettingField)
                            }
                        }}
                        placeholder={t('external-squads-settings.tab.widget.add-override')}
                        value={null}
                    />
                )}
            </Stack>

            <Button
                color="teal"
                fullWidth
                leftSection={<TbDeviceFloppy size="1.2rem" />}
                loading={isUpdatingExternalSquad}
                mt="md"
                onClick={handleUpdateExternalSquad}
                size="md"
                style={{
                    transition: 'all 0.2s ease'
                }}
                variant="light"
            >
                {t('external-squads.drawer.widget.save')}
            </Button>
        </Paper>
    )
}
