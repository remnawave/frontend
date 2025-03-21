import { ActionIcon, CopyButton, Group, Text, Tooltip } from '@mantine/core'
import { PiCheck, PiCopyDuotone } from 'react-icons/pi'

export const CopyableFieldShared = ({
    label,
    value,
    copyText,
    copiedText
}: {
    copiedText: string
    copyText: string
    label: string
    value: string
}) => {
    if (!value) return null

    return (
        <Group align="center" justify="flex-start">
            <Text c="dimmed" size="sm">
                {label}
            </Text>
            <Group gap={'xs'}>
                <Text size="sm" style={{ wordBreak: 'break-all' }}>
                    {value}
                </Text>
                <CopyButton timeout={2000} value={value}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? copiedText : copyText} position="top" withArrow>
                            <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy} size="md">
                                {copied ? <PiCheck size={14} /> : <PiCopyDuotone size={14} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </Group>
        </Group>
    )
}
