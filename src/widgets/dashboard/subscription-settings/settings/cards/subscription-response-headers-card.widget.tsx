import { ActionIcon, Alert, Button, Card, Group, Stack, TextInput } from '@mantine/core'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { PiChatsCircle, PiInfo, PiPlus, PiTrash } from 'react-icons/pi'
import { useCallback, useEffect, useRef, useState } from 'react'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { useForm } from '@mantine/form'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'
import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

interface HeaderItem {
    key: string
    value: string
}

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

export const SubscriptionResponseHeadersCardWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const [headers, setHeaders] = useState<HeaderItem[]>([])

    const updateHeaders = useCallback((newHeaders: HeaderItem[]) => {
        setHeaders(newHeaders)
    }, [])

    const [localHeaders, setLocalHeaders] = useState<HeaderItem[]>(headers)

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
        const headersFiltered = headers.filter((header) => header.key.trim() !== '')

        const customResponseHeaders: Record<string, string> = {}
        headersFiltered.forEach((header) => {
            customResponseHeaders[header.key] = header.value
        })

        mutate({
            variables: {
                uuid: values.uuid,
                customResponseHeaders
            }
        })
    })

    useEffect(() => {
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
    }, [subscriptionSettings])

    const isInitializedRef = useRef(false)

    useEffect(() => {
        if (!isInitializedRef.current && headers.length > 0) {
            if (!(headers.length === 1 && headers[0].key === '' && headers[0].value === '')) {
                setLocalHeaders(headers)
            }
            isInitializedRef.current = true
        }
    }, [headers])

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            updateHeaders(localHeaders)
        }, 100)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [localHeaders, updateHeaders])

    const addLocalHeader = useCallback(() => {
        setLocalHeaders((prev) => [...prev, { key: '', value: '' }])
    }, [])

    const removeLocalHeader = useCallback((index: number) => {
        setLocalHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders.splice(index, 1)
            return newHeaders
        })
    }, [])

    const updateLocalHeaderKey = useCallback((index: number, key: string) => {
        setLocalHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders[index] = { ...newHeaders[index], key }
            return newHeaders
        })
    }, [])

    const updateLocalHeaderValue = useCallback((index: number, value: string) => {
        setLocalHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders[index] = { ...newHeaders[index], value }
            return newHeaders
        })
    }, [])

    return (
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <SettingsCardShared.Container maw="1500px">
                <SettingsCardShared.Header
                    description={t(
                        'subscription-tabs.widget.headers-that-will-be-sent-with-subscription-content'
                    )}
                    icon={<PiChatsCircle size={24} />}
                    title={t('subscription-tabs.widget.additional-response-headers')}
                />

                <SettingsCardShared.Content>
                    <Stack gap="md">
                        <Card.Section p="lg">
                            {localHeaders.map((header, index) => (
                                <Group align="flex-start" gap="sm" key={index} mb="xs">
                                    <ActionIcon
                                        color="red"
                                        onClick={() => removeLocalHeader(index)}
                                        size="input-sm"
                                        variant="light"
                                    >
                                        <PiTrash size="16px" />
                                    </ActionIcon>
                                    <TextInput
                                        onChange={(e) =>
                                            updateLocalHeaderKey(index, e.target.value)
                                        }
                                        placeholder={t('headers-manager.widget.key')}
                                        style={{ flex: '0 0 35%' }}
                                        value={header.key}
                                    />
                                    <TextInput
                                        leftSection={
                                            <TemplateInfoPopoverShared
                                                showHostDescription={false}
                                            />
                                        }
                                        onChange={(e) =>
                                            updateLocalHeaderValue(index, e.target.value)
                                        }
                                        placeholder={t('headers-manager.widget.value')}
                                        style={{ flex: '1' }}
                                        value={header.value}
                                    />
                                </Group>
                            ))}
                        </Card.Section>

                        {form.errors.customResponseHeaders && (
                            <Card.Section p="lg">
                                <Alert
                                    color="red"
                                    icon={<PiInfo />}
                                    title={t('subscription-tabs.widget.error')}
                                >
                                    {form.errors.customResponseHeaders}
                                </Alert>
                            </Card.Section>
                        )}
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <Button
                            leftSection={<PiPlus size="16px" />}
                            onClick={addLocalHeader}
                            size="md"
                            variant="light"
                        >
                            {t('headers-manager.widget.add-header')}
                        </Button>
                        <Button color="teal" loading={isPending} size="md" type="submit">
                            {t('common.save')}
                        </Button>
                    </Group>
                </SettingsCardShared.Bottom>
            </SettingsCardShared.Container>
        </form>
    )
}
