import { ActionIcon, Box, Button, Group, Text, TextInput } from '@mantine/core'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export const RemarksManager = ({
    initialRemarks = [''],
    title,
    onChange
}: {
    initialRemarks?: string[]
    onChange: (remarks: string[]) => void
    title: string
}) => {
    const [localRemarks, setLocalRemarks] = useState<string[]>(initialRemarks)
    const { t } = useTranslation()

    useEffect(() => {
        if (JSON.stringify(initialRemarks) !== JSON.stringify(localRemarks)) {
            setLocalRemarks(initialRemarks)
        }
    }, [initialRemarks])

    useEffect(() => {
        onChange(localRemarks)
    }, [localRemarks, onChange])

    const addLocalRemark = () => {
        setLocalRemarks((prev) => [...prev, ''])
    }

    const removeLocalRemark = (index: number) => {
        setLocalRemarks((prev) => {
            const newRemarks = [...prev]
            newRemarks.splice(index, 1)
            if (newRemarks.length === 0) newRemarks.push('')
            return newRemarks
        })
    }

    const updateLocalRemark = (index: number, value: string) => {
        setLocalRemarks((prev) => {
            const newRemarks = [...prev]
            newRemarks[index] = value
            return newRemarks
        })
    }

    return (
        <Box>
            <Text fw={500} mb="xs">
                {title}
            </Text>
            {localRemarks.map((remark, index) => (
                <Group align="flex-start" gap="sm" key={index} mb="xs">
                    <ActionIcon
                        color="red"
                        disabled={localRemarks.length === 1}
                        onClick={() => removeLocalRemark(index)}
                        size="lg"
                    >
                        <PiTrash size="1rem" />
                    </ActionIcon>
                    <TextInput
                        onChange={(e) => updateLocalRemark(index, e.target.value)}
                        placeholder={t('remarks-manager.widget.enter-remark')}
                        style={{ flex: 1 }}
                        value={remark}
                    />
                </Group>
            ))}
            <Button
                leftSection={<PiPlus size="1rem" />}
                mt="xs"
                onClick={addLocalRemark}
                size="sm"
                variant="light"
            >
                {t('remarks-manager.widget.add-remark')}
            </Button>
        </Box>
    )
}
