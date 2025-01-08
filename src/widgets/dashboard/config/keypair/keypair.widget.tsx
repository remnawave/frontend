import { ActionIcon, Button, Code, CopyButton, Group, Paper, Stack, Text } from '@mantine/core'
import { PiCheck, PiCopy, PiKey } from 'react-icons/pi'
import { generateKeyPair } from '@stablelib/x25519'
import { encodeURLSafe } from '@stablelib/base64'
import { useEffect, useState } from 'react'

export const KeypairWidget = () => {
    const [keyPair, setKeyPair] = useState<{
        privateKey: string
        publicKey: string
    }>({
        publicKey: '',
        privateKey: ''
    })

    const generatePublicAndPrivate = () => {
        const keyPair = generateKeyPair()
        setKeyPair({
            privateKey: encodeURLSafe(keyPair.secretKey).replace(/=/g, '').replace(/\n/g, ''),
            publicKey: encodeURLSafe(keyPair.publicKey).replace(/=/g, '').replace(/\n/g, '')
        })
    }

    useEffect(() => {
        generatePublicAndPrivate()
    }, [])

    return (
        <Paper p="md" radius="xs">
            <Stack gap="md">
                <Button
                    leftSection={<PiKey size="1.2rem" />}
                    onClick={generatePublicAndPrivate}
                    size="sm"
                    variant="outline"
                    w="320px"
                >
                    Generate Key Pair
                </Button>

                <Group gap="xs">
                    <Text c="dimmed" fw={500} size="sm" w="9ch">
                        Private Key
                    </Text>
                    <CopyButton value={keyPair.privateKey}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                ml="xs"
                                onClick={copy}
                                variant="subtle"
                            >
                                {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                    <Code p="xs">{keyPair.privateKey}</Code>
                </Group>

                <Group gap="xs">
                    <Text c="dimmed" fw={500} size="sm" w="9ch">
                        Public Key
                    </Text>
                    <CopyButton value={keyPair.publicKey}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                ml="xs"
                                onClick={copy}
                                variant="subtle"
                            >
                                {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                    <Code p="xs">{keyPair.publicKey}</Code>
                </Group>
            </Stack>
        </Paper>
    )
}
