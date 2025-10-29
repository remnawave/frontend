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
import { GetExternalSquadByUuidCommand } from '@remnawave/backend-contract'
import { useEffect, useMemo, useState } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { z } from 'zod'

import { QueryKeys, useUpdateExternalSquad } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

interface IFieldConfig {
    description?: string
    hoverCard?: React.ReactNode
    inputType?: 'boolean' | 'number' | 'string' | 'textarea'
    label: string
    leftSection?: React.ReactNode
    rightSection?: React.ReactNode
}

interface IOverridesTabConfig<T extends Record<string, unknown>> {
    addPlaceholder: string
    description: string
    getCurrentOverrides: (
        externalSquad: GetExternalSquadByUuidCommand.Response['response']
    ) => null | T | undefined
    overrideKey: 'hostOverrides' | 'subscriptionSettings'
    resolveFieldConfig: (field: keyof T, t: TFunction) => IFieldConfig
    schemaShape: Record<string, z.ZodTypeAny>
    title: string
}

interface IProps<T extends Record<string, unknown>> {
    config: IOverridesTabConfig<T>
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

export function ExternalSquadOverridesTab<T extends Record<string, unknown>>(props: IProps<T>) {
    const { externalSquad, isOpen, config } = props
    const { t } = useTranslation()

    const [overrides, setOverrides] = useState<T>({} as T)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [fieldOrder, setFieldOrder] = useState<string[]>([])

    useEffect(() => {
        if (isOpen && externalSquad) {
            const currentOverrides = config.getCurrentOverrides(externalSquad)
            if (currentOverrides) {
                const newKeys = Object.keys(currentOverrides)
                const preservedOrder = fieldOrder.filter((key) => newKeys.includes(key))
                const newFields = newKeys.filter((key) => !fieldOrder.includes(key))

                setFieldOrder([...preservedOrder, ...newFields])
                setOverrides(currentOverrides)
            } else {
                setFieldOrder(Object.keys(config.schemaShape))
                setOverrides({} as T)
            }

            setErrors({})
        }
    }, [isOpen, externalSquad, config])

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

    const validateOverrides = (): boolean => {
        try {
            const activeFields = Object.keys(overrides).reduce(
                (acc, key) => {
                    if (config.schemaShape[key]) {
                        acc[key] = config.schemaShape[key]
                    }
                    return acc
                },
                {} as Record<string, z.ZodTypeAny>
            )

            const schema = z.object(activeFields)
            schema.parse(overrides)
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        const fieldName = err.path[0] as string
                        newErrors[fieldName] = err.message
                    }
                })
                setErrors(newErrors)
                return false
            }
            return false
        }
    }

    const handleUpdateExternalSquad = () => {
        if (!externalSquad) return

        if (!validateOverrides()) {
            return
        }

        updateExternalSquad({
            variables: {
                [config.overrideKey]: overrides,
                uuid: externalSquad.uuid
            }
        })
    }

    const handleAddOverride = (field: keyof T) => {
        setOverrides((prev) => {
            const fieldConfig = config.resolveFieldConfig(field, t)
            let defaultValue: boolean | null | number | string | undefined

            switch (fieldConfig.inputType) {
                case 'boolean':
                    defaultValue = false
                    break
                case 'number':
                    defaultValue = undefined
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
        setFieldOrder((prev) => [...prev, String(field)])
    }

    const handleRemoveOverride = (field: keyof T) => {
        setOverrides((prev) => {
            const newSettings = { ...prev }
            delete newSettings[field]
            return newSettings
        })
        setFieldOrder((prev) => prev.filter((key) => key !== String(field)))
    }

    const handleUpdateOverride = (field: keyof T, value: boolean | null | number | string) => {
        setOverrides((prev) => ({
            ...prev,
            [field]: value
        }))
        setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[String(field)]
            return newErrors
        })
    }

    const availableFields = useMemo(() => {
        return Object.keys(config.schemaShape).filter((field) => !(field in overrides))
    }, [overrides, config.schemaShape])

    const sortedOverrideKeys = useMemo(() => {
        return fieldOrder.filter((key) => key in overrides)
    }, [fieldOrder, overrides])

    const renderField = (field: keyof T) => {
        const fieldConfig = config.resolveFieldConfig(field, t)
        if (!fieldConfig) return null

        const value = overrides[field]
        const error = errors[String(field)]
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
                            onChange={(e) => handleUpdateOverride(field, e.currentTarget.checked)}
                            size="md"
                        />
                    </Group>
                )
            case 'number':
                return (
                    <NumberInput
                        error={error}
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={600} size="sm">
                                    {label}
                                </Text>
                                {hoverCard}
                            </Group>
                        }
                        leftSection={leftSection}
                        onChange={(val) => handleUpdateOverride(field, Number(val))}
                        rightSection={rightSection}
                        size="sm"
                        value={Number(value) || undefined}
                    />
                )
            case 'string':
                return (
                    <TextInput
                        error={error}
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={600} size="sm">
                                    {label}
                                </Text>
                                {hoverCard}
                            </Group>
                        }
                        leftSection={leftSection}
                        onChange={(e) => handleUpdateOverride(field, e.currentTarget.value)}
                        rightSection={rightSection}
                        size="sm"
                        value={String(value || '')}
                    />
                )
            case 'textarea':
                return (
                    <Textarea
                        error={error}
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
                        onChange={(e) => handleUpdateOverride(field, e.currentTarget.value)}
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
                    {config.title}
                </Text>
                <Text c="dimmed" size="sm">
                    {config.description}
                </Text>

                {sortedOverrideKeys.length > 0 && (
                    <Stack gap="md">
                        {sortedOverrideKeys.map((field) => {
                            const fieldConfig = config.resolveFieldConfig(field as keyof T, t)
                            const { inputType } = fieldConfig
                            const isCheckbox = inputType === 'boolean'

                            return (
                                <Paper bg="dark.7" key={String(field)} p="md" withBorder>
                                    <Group align="center" gap="xs" wrap="nowrap">
                                        <Box style={{ flex: 1 }}>
                                            {renderField(field as keyof T)}
                                        </Box>
                                        <ActionIcon
                                            color="red"
                                            mt={!isCheckbox ? '1.5rem' : 0}
                                            onClick={() => handleRemoveOverride(field as keyof T)}
                                            size="input-sm"
                                            variant="subtle"
                                        >
                                            <PiTrash size={20} />
                                        </ActionIcon>
                                    </Group>
                                </Paper>
                            )
                        })}
                    </Stack>
                )}

                {availableFields.length > 0 && (
                    <Select
                        clearable
                        data={availableFields.map((field) => ({
                            label: config.resolveFieldConfig(field as keyof T, t).label,
                            value: field
                        }))}
                        leftSection={<PiPlus size={16} />}
                        onChange={(value) => {
                            if (value) {
                                handleAddOverride(value as keyof T)
                            }
                        }}
                        placeholder={config.addPlaceholder}
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
                {t('common.save')}
            </Button>
        </Paper>
    )
}
