import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
    ActionIcon,
    Alert,
    Button,
    Divider,
    Group,
    Stack,
    TagsInput,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import { GetExternalSquadByUuidCommand } from '@remnawave/backend-contract'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiInfo, PiPlus, PiTrash } from 'react-icons/pi'
import { TbDeviceFloppy, TbPrescription } from 'react-icons/tb'

import { HelpActionIconShared } from '@shared/_modals/universal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetSubscriptionSettings, useUpdateExternalSquad } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'
import { SectionCard } from '@shared/ui/section-card'
import { TagInputPill } from '@shared/ui/tag-input-pill/tag-input-pill'
import { sortResponseHeadersByPriority } from '@shared/utils/misc'

interface HeaderItem {
    key: string
    value: string
}

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
}

const HEADER_NAME_REGEX = /^[!#$%&'*+\-.0-9A-Z^_`a-z|~]+$/
const HEADER_VALUE_REGEX = /^$|^[\x21-\x7E]([\x20-\x7E]*[\x21-\x7E])?$/

export const ExternalSquadsResponseHeadersTabWidget = (props: IProps) => {
    const { externalSquad } = props
    const { t } = useTranslation()

    const [addHeaders, setAddHeaders] = useState<HeaderItem[]>([])
    const [removeKeys, setRemoveKeys] = useState<string[]>([])

    const { data: subscriptionSettings } = useGetSubscriptionSettings()
    const inheritedHeaderKeys = Object.keys(subscriptionSettings?.customResponseHeaders ?? {})

    const [error, setError] = useState<null | string>(null)
    const [parent] = useAutoAnimate({
        duration: 100,
        easing: 'ease-in-out',
        disrespectUserMotionPreference: false
    })

    useEffect(() => {
        setAddHeaders(
            sortResponseHeadersByPriority(
                Object.entries(externalSquad.responseHeadersAdd ?? {}).map(([key, value]) => ({
                    key,
                    value: String(value)
                }))
            )
        )
        setRemoveKeys(externalSquad.responseHeadersRemove ?? [])
    }, [externalSquad])

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

        const headersFiltered = addHeaders
            .map((header) => ({
                key: header.key.trim().toLowerCase(),
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

            if (header.value.includes('\n') && !header.value.startsWith('rwEncodeBase64:')) {
                setError(`Multiline value of "${header.key}" requires the rwEncodeBase64: prefix`)
                return
            }

            if (
                !header.value.startsWith('rwEncodeBase64:') &&
                !HEADER_VALUE_REGEX.test(header.value)
            ) {
                setError(`Invalid header value: ${header.value}`)
                return
            }
        }

        const uniqueRemoveKeys = [
            ...new Set(removeKeys.map((key) => key.trim().toLowerCase()))
        ].filter((key) => key !== '')

        for (const key of uniqueRemoveKeys) {
            if (!HEADER_NAME_REGEX.test(key)) {
                setError(`Invalid header name: ${key}`)
                return
            }
        }

        const responseHeadersAdd: Record<string, string> = {}
        uniqueHeaders.forEach((header) => {
            responseHeadersAdd[header.key] = header.value
        })

        setAddHeaders(uniqueHeaders)
        setRemoveKeys(uniqueRemoveKeys)

        updateExternalSquad({
            variables: {
                uuid: externalSquad.uuid,
                responseHeadersAdd,
                responseHeadersRemove: uniqueRemoveKeys
            }
        })
    }

    const addLocalHeader = useCallback(() => {
        setAddHeaders((prev) => [...prev, { key: '', value: '' }])
    }, [])

    const removeLocalHeader = useCallback((index: number) => {
        setAddHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders.splice(index, 1)
            return newHeaders
        })
    }, [])

    const updateLocalHeaderKey = useCallback((index: number, key: string) => {
        setAddHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders[index] = { ...newHeaders[index], key }
            return newHeaders
        })
    }, [])

    const updateLocalHeaderValue = useCallback((index: number, value: string) => {
        setAddHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders[index] = { ...newHeaders[index], value }
            return newHeaders
        })
    }, [])

    return (
        <SectionCard.Root>
            <SectionCard.Section>
                <Group justify="space-between" wrap="nowrap">
                    <BaseOverlayHeader
                        IconComponent={TbPrescription}
                        iconVariant="soft"
                        title={t('external-squads-response-headers.widget.response-headers')}
                    />
                    <Group>
                        <HelpActionIconShared screen="PAGE_RESPONSE_HEADERS" />
                        <Button
                            color="teal"
                            leftSection={<TbDeviceFloppy size="1.2rem" />}
                            loading={isUpdatingExternalSquad}
                            onClick={handleUpdateExternalSquad}
                            size="md"
                            style={{
                                transition: 'all 0.2s ease'
                            }}
                            variant="soft"
                        >
                            {t('common.action.save')}
                        </Button>
                    </Group>
                </Group>
            </SectionCard.Section>
            <SectionCard.Section>
                <Stack gap="md">
                    <Text c="dimmed" size="sm">
                        {t('external-squads-response-headers.widget.headers-inherited-description')}
                    </Text>

                    <Divider
                        label={t('external-squads-response-headers.widget.add-headers')}
                        labelPosition="left"
                    />

                    <Text c="dimmed" size="sm">
                        {t('external-squads-response-headers.widget.add-headers-description')}
                    </Text>

                    <Stack gap="xs" ref={parent}>
                        {addHeaders.map((header, index) => (
                            <Group align="flex-start" gap="sm" key={index}>
                                <TextInput
                                    onChange={(e) => updateLocalHeaderKey(index, e.target.value)}
                                    placeholder={t('headers-manager.widget.key')}
                                    style={{ flex: '0 0 35%' }}
                                    value={header.key}
                                />
                                <Textarea
                                    autosize
                                    leftSection={<TemplateInfoPopoverShared />}
                                    maxRows={6}
                                    minRows={1}
                                    onChange={(e) => updateLocalHeaderValue(index, e.target.value)}
                                    placeholder={t('headers-manager.widget.value')}
                                    style={{ flex: '1' }}
                                    value={header.value}
                                />
                                <ActionIcon
                                    color="red"
                                    onClick={() => removeLocalHeader(index)}
                                    size="input-sm"
                                    variant="soft"
                                >
                                    <PiTrash size="16px" />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>

                    <Group justify="flex-end">
                        <Button
                            leftSection={<PiPlus size="16px" />}
                            onClick={addLocalHeader}
                            size="sm"
                            variant="soft"
                        >
                            {t('headers-manager.widget.add-header')}
                        </Button>
                    </Group>

                    <Divider
                        label={t('external-squads-response-headers.widget.remove-headers')}
                        labelPosition="left"
                    />

                    <Text c="dimmed" size="sm">
                        {t('external-squads-response-headers.widget.remove-headers-description')}
                    </Text>

                    <TagsInput
                        clearable
                        data={inheritedHeaderKeys}
                        onChange={setRemoveKeys}
                        placeholder={t('external-squads-response-headers.widget.enter-header-key')}
                        splitChars={[',', ' ']}
                        renderOption={({ option }) => {
                            const headerValue =
                                subscriptionSettings?.customResponseHeaders?.[option.value]

                            return (
                                <Group gap={6} miw={0} wrap="nowrap">
                                    <Text size="sm">{option.value}</Text>
                                    {headerValue && (
                                        <Text c="dimmed" size="xs" truncate>
                                            {headerValue}
                                        </Text>
                                    )}
                                </Group>
                            )
                        }}
                        renderPill={({ value, onRemove }) => (
                            <TagInputPill onRemove={onRemove} value={value} />
                        )}
                        value={removeKeys}
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                    />

                    {error && (
                        <Alert color="red" icon={<PiInfo />}>
                            {error}
                        </Alert>
                    )}
                </Stack>
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
