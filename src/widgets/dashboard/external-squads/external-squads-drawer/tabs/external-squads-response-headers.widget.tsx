import { ActionIcon, Alert, Button, Group, Paper, Stack, Text, TextInput } from '@mantine/core'
import { GetExternalSquadByUuidCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { PiInfo, PiPlus, PiTrash } from 'react-icons/pi'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'
import { QueryKeys, useUpdateExternalSquad } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

interface HeaderItem {
    key: string
    value: string
}

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

const HEADER_NAME_REGEX = /^[!#$%&'*+\-.0-9A-Z^_`a-z|~]+$/
const HEADER_VALUE_REGEX = /^[\x21-\x7E]([\x20-\x7E]*[\x21-\x7E])?$/

export const ExternalSquadsResponseHeadersTabWidget = (props: IProps) => {
    const { externalSquad, isOpen } = props
    const { t } = useTranslation()

    const [headers, setHeaders] = useState<HeaderItem[]>([])
    const [localHeaders, setLocalHeaders] = useState<HeaderItem[]>(headers)

    const isInitializedRef = useRef(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const [error, setError] = useState<null | string>(null)
    const [parent] = useAutoAnimate({
        duration: 100,
        easing: 'ease-in-out',
        disrespectUserMotionPreference: false
    })

    const updateHeaders = useCallback((newHeaders: HeaderItem[]) => {
        setHeaders(newHeaders)
    }, [])

    const { mutate: updateExternalSquad, isPending: isUpdatingExternalSquad } =
        useUpdateExternalSquad({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        QueryKeys.externalSquads.getExternalSquad({
                            uuid: data.uuid
                        }).queryKey,
                        data
                    )
                    setError(null)
                },
                onError: (err) => {
                    setError(err instanceof Error ? err.message : 'Unknown error occurred')
                }
            }
        })

    const handleUpdateExternalSquad = () => {
        if (!externalSquad?.uuid) return

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
                setError(`Invalid header name: ${header.key}`)
                return
            }
            if (!HEADER_VALUE_REGEX.test(header.value)) {
                setError(`Invalid header value: ${header.value}`)
                return
            }
        }

        const responseHeaders: Record<string, string> = {}
        uniqueHeaders.forEach((header) => {
            responseHeaders[header.key] = header.value
        })

        setLocalHeaders(uniqueHeaders)

        updateExternalSquad({
            variables: {
                uuid: externalSquad.uuid,
                responseHeaders
            }
        })
    }

    useEffect(() => {
        if (isOpen && externalSquad) {
            if (
                externalSquad.responseHeaders &&
                typeof externalSquad.responseHeaders === 'object' &&
                externalSquad.responseHeaders !== null
            ) {
                const headerItems = Object.entries(externalSquad.responseHeaders).map(
                    ([key, value]) => ({ key, value: String(value) })
                )
                setHeaders(headerItems)
            } else {
                setHeaders([])
            }
        }
    }, [isOpen, externalSquad])

    useEffect(() => {
        if (!isInitializedRef.current && headers.length > 0) {
            if (!(headers.length === 1 && headers[0].key === '' && headers[0].value === '')) {
                setLocalHeaders(headers)
            }
            isInitializedRef.current = true
        }
    }, [headers])

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
        <Paper bg="dark.6" p="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Text fw={600} size="md">
                    {t('external-squads-response-headers.widget.response-headers')}
                </Text>
                <Text c="dimmed" size="sm">
                    {t(
                        'subscription-tabs.widget.headers-that-will-be-sent-with-subscription-content'
                    )}
                </Text>

                <Stack gap="xs" ref={parent}>
                    {localHeaders.map((header, index) => (
                        <Group align="flex-start" gap="sm" key={index}>
                            <TextInput
                                onChange={(e) => updateLocalHeaderKey(index, e.target.value)}
                                placeholder={t('headers-manager.widget.key')}
                                style={{ flex: '0 0 35%' }}
                                value={header.key}
                            />
                            <TextInput
                                leftSection={<TemplateInfoPopoverShared />}
                                onChange={(e) => updateLocalHeaderValue(index, e.target.value)}
                                placeholder={t('headers-manager.widget.value')}
                                style={{ flex: '1' }}
                                value={header.value}
                            />
                            <ActionIcon
                                color="red"
                                onClick={() => removeLocalHeader(index)}
                                size="input-sm"
                                variant="light"
                            >
                                <PiTrash size="16px" />
                            </ActionIcon>
                        </Group>
                    ))}
                </Stack>

                {error && (
                    <Alert color="red" icon={<PiInfo />}>
                        {error}
                    </Alert>
                )}

                <Group justify="flex-end" mt="md">
                    <Button
                        leftSection={<PiPlus size="16px" />}
                        onClick={addLocalHeader}
                        size="md"
                        variant="light"
                    >
                        {t('headers-manager.widget.add-header')}
                    </Button>
                    <Button
                        color="teal"
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
                </Group>
            </Stack>
        </Paper>
    )
}
