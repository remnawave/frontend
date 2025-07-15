import {
    ActionIcon,
    Button,
    DefaultMantineColor,
    Group,
    Paper,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'

export const RemarksManager = ({
    initialRemarks = [''],
    title,
    onChange,
    icon,
    iconColor
}: {
    icon: React.ReactNode
    iconColor: DefaultMantineColor
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
        <Paper p="sm" radius="md" shadow="xs" withBorder>
            <Group align="center" gap="xs" justify="flex-start" mb="md">
                <ThemeIcon color={iconColor} radius="md" size="md" variant="light">
                    {icon}
                </ThemeIcon>
                <Text fw={600} size="sm">
                    {title}
                </Text>
            </Group>

            {localRemarks.map((remark, index) => (
                <Group align="flex-start" gap="sm" key={index} mb="xs">
                    <ActionIcon
                        color="red"
                        disabled={localRemarks.length === 1}
                        onClick={() => removeLocalRemark(index)}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <PiTrash size="16px" />
                    </ActionIcon>
                    <TextInput
                        leftSection={<TemplateInfoPopoverShared showHostDescription={false} />}
                        onChange={(e) => updateLocalRemark(index, e.target.value)}
                        placeholder={t('remarks-manager.widget.enter-remark')}
                        style={{ flex: 1 }}
                        value={remark}
                    />
                </Group>
            ))}
            <Button
                leftSection={<PiPlus size="16px" />}
                mt="xs"
                onClick={addLocalRemark}
                size="sm"
                variant="light"
            >
                {t('remarks-manager.widget.add-remark')}
            </Button>
        </Paper>
    )
}
