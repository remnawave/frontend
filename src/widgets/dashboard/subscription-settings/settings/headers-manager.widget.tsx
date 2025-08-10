import { ActionIcon, Button, Group, TextInput } from '@mantine/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'

export interface HeaderItem {
    key: string
    value: string
}

export interface HeadersManagerProps {
    initialHeaders?: HeaderItem[]
    onChange: (headers: HeaderItem[]) => void
}

export const HeadersManager = (props: HeadersManagerProps) => {
    const { initialHeaders = [{ key: '', value: '' }], onChange } = props

    const [localHeaders, setLocalHeaders] = useState<HeaderItem[]>(initialHeaders)
    const { t } = useTranslation()

    const isInitializedRef = useRef(false)

    useEffect(() => {
        if (!isInitializedRef.current && initialHeaders.length > 0) {
            if (
                !(
                    initialHeaders.length === 1 &&
                    initialHeaders[0].key === '' &&
                    initialHeaders[0].value === ''
                )
            ) {
                setLocalHeaders(initialHeaders)
            }
            isInitializedRef.current = true
        }
    }, [initialHeaders])

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            onChange(localHeaders)
        }, 100)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [localHeaders, onChange])

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
        <>
            {localHeaders.map((header, index) => (
                <Group align="flex-start" gap="sm" key={index} mb="xs">
                    <ActionIcon
                        color="red"
                        onClick={() => removeLocalHeader(index)}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <PiTrash size="16px" />
                    </ActionIcon>
                    <TextInput
                        onChange={(e) => updateLocalHeaderKey(index, e.target.value)}
                        placeholder={t('headers-manager.widget.key')}
                        style={{ flex: 1 }}
                        value={header.key}
                    />
                    <TextInput
                        leftSection={<TemplateInfoPopoverShared showHostDescription={false} />}
                        onChange={(e) => updateLocalHeaderValue(index, e.target.value)}
                        placeholder={t('headers-manager.widget.value')}
                        style={{ flex: 1 }}
                        value={header.value}
                    />
                </Group>
            ))}
            <Button
                leftSection={<PiPlus size="16px" />}
                mt="xs"
                onClick={addLocalHeader}
                size="sm"
                variant="light"
            >
                {t('headers-manager.widget.add-header')}
            </Button>
        </>
    )
}
