import { ActionIcon, Button, Group, TextInput } from '@mantine/core'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

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

    useEffect(() => {
        if (JSON.stringify(initialHeaders) !== JSON.stringify(localHeaders)) {
            setLocalHeaders(initialHeaders)
        }
    }, [initialHeaders])

    useEffect(() => {
        onChange(localHeaders)
    }, [localHeaders, onChange])

    const addLocalHeader = () => {
        setLocalHeaders((prev) => [...prev, { key: '', value: '' }])
    }

    const removeLocalHeader = (index: number) => {
        setLocalHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders.splice(index, 1)
            return newHeaders
        })
    }

    const updateLocalHeaderKey = (index: number, key: string) => {
        setLocalHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders[index] = { ...newHeaders[index], key }
            return newHeaders
        })
    }

    const updateLocalHeaderValue = (index: number, value: string) => {
        setLocalHeaders((prev) => {
            const newHeaders = [...prev]
            newHeaders[index] = { ...newHeaders[index], value }
            return newHeaders
        })
    }

    return (
        <>
            {localHeaders.map((header, index) => (
                <Group
                    align="flex-start"
                    gap="sm"
                    key={`${index}-${header.key}-${header.value}`}
                    mb="xs"
                >
                    <ActionIcon
                        color="red"
                        onClick={() => removeLocalHeader(index)}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <PiTrash size="1rem" />
                    </ActionIcon>
                    <TextInput
                        onChange={(e) => updateLocalHeaderKey(index, e.target.value)}
                        placeholder={t('headers-manager.widget.key')}
                        style={{ flex: 1 }}
                        value={header.key}
                    />
                    <TextInput
                        onChange={(e) => updateLocalHeaderValue(index, e.target.value)}
                        placeholder={t('headers-manager.widget.value')}
                        style={{ flex: 1 }}
                        value={header.value}
                    />
                </Group>
            ))}
            <Button
                leftSection={<PiPlus size="1rem" />}
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
