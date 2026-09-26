import { ActionIcon, Alert, Button, Card, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiChatsCircle, PiInfo, PiPlus, PiTrash } from 'react-icons/pi'

import { HelpActionIconShared } from '@shared/_modals/universal/help-drawer/help-action-icon.shared'
import { queryClient } from '@shared/api'
import { QueryKeys, useUpdateSubscriptionSettings } from '@shared/api/hooks'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { handleFormErrors, sortResponseHeadersByPriority } from '@shared/utils/misc'

interface HeaderItem {
    key: string
    value: string
}

interface IProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

const HEADER_NAME_REGEX = /^[!#$%&'*+\-.0-9A-Z^_`a-z|~]+$/
const HEADER_VALUE_REGEX = /^$|^[\x21-\x7E]([\x20-\x7E]*[\x21-\x7E])?$/

export const SubscriptionResponseHeadersCardWidget = (props: IProps) => {
    const { subscriptionSettings } = props
    const { t } = useTranslation()

    const [headers, setHeaders] = useState<HeaderItem[]>([])

    const updateHeaders = useCallback((newHeaders: HeaderItem[]) => {
        setHeaders(newHeaders)
    }, [])

    const [localHeaders, setLocalHeaders] = useState<HeaderItem[]>(headers)

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
            },

            onError(error) {
                handleFormErrors(form, error)
            }
        }
    })

    const handleSubmit = form.onSubmit((values) => {
        const headersFiltered = headers
            .map((header) => ({
                key: header.key.trim(),
                value: header.value.trim()
            }))
            .filter((header) => header.key !== '')

        const seen = new Set<string>()
        const uniqueHeaders: HeaderItem[] = []
        for (let i = headersFiltered.length - 1; i >= 0; i--) {
            const header = headersFiltered[i]
            if (!seen.has(header.key)) {
                uniqueHeaders.unshift(header)
                seen.add(header.key)
            }
        }

        for (const header of uniqueHeaders) {
            if (!HEADER_NAME_REGEX.test(header.key)) {
                form.setFieldError('customResponseHeaders', `Invalid header name: ${header.key}`)
                return
            }
            if (header.value.includes('\n') && !header.value.startsWith('rwEncodeBase64:')) {
                form.setFieldError(
                    'customResponseHeaders',
                    `Multiline value of "${header.key}" requires the rwEncodeBase64: prefix`
                )
                return
            }
            if (
                !header.value.startsWith('rwEncodeBase64:') &&
                !HEADER_VALUE_REGEX.test(header.value)
            ) {
                form.setFieldError('customResponseHeaders', `Invalid header value: ${header.value}`)
                return
            }
        }

        const responseHeaders: Record<string, string> = {}
        uniqueHeaders.forEach((header) => {
            responseHeaders[header.key] = header.value
        })

        mutate({
            variables: {
                uuid: values.uuid,
                customResponseHeaders: responseHeaders
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
            setHeaders(sortResponseHeadersByPriority(headerItems))
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
                    iconColor="cyan"
                    iconVariant="soft"
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
                                        variant="soft"
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
                                    <Textarea
                                        autosize
                                        leftSection={<TemplateInfoPopoverShared />}
                                        maxRows={6}
                                        minRows={1}
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
                                    title={t('common.message.error')}
                                >
                                    {form.errors.customResponseHeaders}
                                </Alert>
                            </Card.Section>
                        )}
                    </Stack>
                </SettingsCardShared.Content>

                <SettingsCardShared.Bottom>
                    <Group justify="flex-end">
                        <HelpActionIconShared screen="PAGE_RESPONSE_HEADERS" />

                        <Button
                            leftSection={<PiPlus size="16px" />}
                            onClick={addLocalHeader}
                            size="md"
                            variant="soft"
                        >
                            {t('headers-manager.widget.add-header')}
                        </Button>
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
