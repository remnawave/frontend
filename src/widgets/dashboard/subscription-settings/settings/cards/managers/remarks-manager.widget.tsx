import {
    ActionIcon,
    Button,
    Card,
    DefaultMantineColor,
    Divider,
    Group,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useCallback, useEffect, useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { PiPlus, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

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
    const [debouncedRemarks] = useDebouncedValue(localRemarks, 300)
    const { t } = useTranslation()

    const [parent] = useAutoAnimate((el, action) => {
        let keyframes: Keyframe[] | undefined
        if (action === 'add') {
            keyframes = [
                { transform: 'scale(.98)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
            ]
        }
        if (action === 'remove') {
            keyframes = [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(.98)', opacity: 0 }
            ]
        }
        if (action === 'remain') {
            keyframes = [{ opacity: 0.98 }, { opacity: 1 }]
        }

        return new KeyframeEffect(el, keyframes as Keyframe[], {
            duration: 250,
            easing: 'ease-in-out'
        })
    })

    useEffect(() => {
        setLocalRemarks(initialRemarks)
    }, [initialRemarks])

    useEffect(() => {
        onChange(debouncedRemarks)
    }, [debouncedRemarks, onChange])

    const addLocalRemark = useCallback(() => {
        setLocalRemarks((prev) => [...prev, ''])
    }, [])

    const removeLocalRemark = useCallback((index: number) => {
        setLocalRemarks((prev) => {
            const newRemarks = [...prev]
            newRemarks.splice(index, 1)
            if (newRemarks.length === 0) newRemarks.push('')
            return newRemarks
        })
    }, [])

    const updateLocalRemark = useCallback((index: number, value: string) => {
        setLocalRemarks((prev) => {
            const newRemarks = [...prev]
            newRemarks[index] = value
            return newRemarks
        })
    }, [])

    return (
        <Card>
            <Stack gap="md">
                <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                    <Group align="center" gap="xs" wrap="nowrap">
                        <ThemeIcon color={iconColor} size="lg" variant="light">
                            {icon}
                        </ThemeIcon>
                        <Text fw={600} size="md">
                            {title}
                        </Text>
                    </Group>

                    <Button
                        leftSection={<PiPlus size="16px" />}
                        onClick={addLocalRemark}
                        size="sm"
                        variant="light"
                    >
                        {t('common.add')}
                    </Button>
                </Group>

                <Divider />

                <Stack gap="xs" ref={parent}>
                    {localRemarks.map((remark, index) => (
                        <Group align="flex-start" gap="sm" key={index}>
                            <TextInput
                                leftSection={<TemplateInfoPopoverShared />}
                                onChange={(e) => updateLocalRemark(index, e.target.value)}
                                placeholder={t('remarks-manager.widget.enter-remark')}
                                style={{ flex: 1 }}
                                value={remark}
                            />
                            <ActionIcon
                                color="red"
                                disabled={localRemarks.length === 1}
                                onClick={() => removeLocalRemark(index)}
                                size="lg"
                                variant="light"
                            >
                                <PiTrash size="16px" />
                            </ActionIcon>
                        </Group>
                    ))}
                </Stack>
            </Stack>
        </Card>
    )
}
