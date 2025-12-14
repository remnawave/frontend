import { Box, Group, Stack, Text, Textarea, ThemeIcon, Tooltip } from '@mantine/core'
import { IconAlertTriangle, IconPhoto } from '@tabler/icons-react'
import { useMemo } from 'react'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    color?: string
    label?: string
    minRows?: number
    onChange: (value: string) => void
    placeholder?: string
    value: string
}

export function SvgIconInput(props: IProps) {
    const {
        color = 'cyan',
        label = 'SVG Icon',
        minRows = 2,
        onChange,
        placeholder = '<svg>...</svg>',
        value
    } = props

    const { isValid, sanitizedSvg } = useMemo(() => {
        if (!value || !value.trim()) {
            return { isValid: false, sanitizedSvg: '' }
        }

        const trimmed = value.trim()
        const isSvg = trimmed.startsWith('<svg') && trimmed.includes('</svg>')

        if (!isSvg) {
            return { isValid: false, sanitizedSvg: '' }
        }

        return { isValid: true, sanitizedSvg: trimmed }
    }, [value, color])

    const renderPreviewContent = () => {
        if (isValid) {
            return (
                <ThemeIcon
                    color={color}
                    radius="xl"
                    size={44}
                    style={{
                        background: `linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)`,
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        flexShrink: 0
                    }}
                    variant="light"
                >
                    <span
                        dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
                        style={{ display: 'flex', alignItems: 'center' }}
                    />
                </ThemeIcon>
            )
        }

        if (value) {
            return <IconAlertTriangle color="var(--mantine-color-orange-5)" size={20} />
        }

        return <IconPhoto color="var(--mantine-color-dimmed)" size={20} />
    }

    return (
        <Stack gap="xs">
            <Group align="flex-start" gap="sm">
                <Textarea
                    classNames={{ input: styles.inputDark }}
                    label={label}
                    minRows={minRows}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ flex: 1 }}
                    value={value}
                />

                <Stack gap={4}>
                    <Text c="dimmed" size="xs">
                        Preview
                    </Text>
                    <Tooltip
                        disabled={isValid || !value}
                        label="Invalid SVG format"
                        position="top"
                        withArrow
                    >
                        <Box className={styles.svgPreviewBox}>{renderPreviewContent()}</Box>
                    </Tooltip>
                </Stack>
            </Group>
        </Stack>
    )
}
