import { ActionIcon, CopyButton, Group, TextInput } from '@mantine/core'
import { PiCheck, PiCopy } from 'react-icons/pi'

export const CopyableFieldShared = ({
    label,
    value
}: {
    label: string
    value: number | string
}) => {
    if (!value) return null

    return (
        <Group align="center" justify="flex-start">
            <TextInput
                label={label}
                leftSection={
                    <CopyButton timeout={2000} value={value.toString()}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                onClick={copy}
                                variant="subtle"
                            >
                                {copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                }
                readOnly
                value={value.toString()}
                w={'100%'}
            />
        </Group>
    )
}
