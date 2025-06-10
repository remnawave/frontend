import { ActionIcon, Button, Code, CopyButton, Divider, Group, Stack, Text } from '@mantine/core'
import { PiCheck, PiCopy, PiKey } from 'react-icons/pi'
import { generateKeyPair } from '@stablelib/x25519'
import { encodeURLSafe } from '@stablelib/base64'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export const KeypairWidget = () => {
    const { t } = useTranslation()

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
        <Stack gap="lg">
            <Button
                fullWidth
                gradient={{ from: 'blue', to: 'cyan' }}
                leftSection={<PiKey size="1.2rem" />}
                onClick={generatePublicAndPrivate}
                size="sm"
                variant="outline"
            >
                {t('keypair.widget.generate-key-pair')}
            </Button>

            <Divider />

            <Stack gap="md">
                <Stack gap="xs">
                    <Group align="center" justify="space-between">
                        <Text fw={600} size="sm">
                            {t('keypair.widget.public-key')}
                        </Text>
                        <CopyButton value={keyPair.publicKey}>
                            {({ copied, copy }) => (
                                <ActionIcon
                                    color={copied ? 'teal' : 'blue'}
                                    onClick={copy}
                                    size="sm"
                                    variant="light"
                                >
                                    {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </Group>
                    <Code
                        block
                        p="sm"
                        style={{
                            wordBreak: 'break-all',
                            fontSize: '12px',
                            lineHeight: 1.4
                        }}
                    >
                        {keyPair.publicKey}
                    </Code>
                </Stack>

                <Stack gap="xs">
                    <Group align="center" justify="space-between">
                        <Text fw={600} size="sm">
                            {t('keypair.widget.private-key')}
                        </Text>
                        <CopyButton value={keyPair.privateKey}>
                            {({ copied, copy }) => (
                                <ActionIcon
                                    color={copied ? 'teal' : 'blue'}
                                    onClick={copy}
                                    size="sm"
                                    variant="light"
                                >
                                    {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </Group>
                    <Code
                        block
                        p="sm"
                        style={{
                            wordBreak: 'break-all',
                            fontSize: '12px',
                            lineHeight: 1.4
                        }}
                    >
                        {keyPair.privateKey}
                    </Code>
                </Stack>

                <Divider />

                <Stack gap="xs">
                    <Group align="center" justify="space-between">
                        <Text fw={600} size="sm">
                            {t('keypair.widget.both-keys')}
                        </Text>
                        <CopyButton
                            value={`"publicKey": "${keyPair.publicKey}",
"privateKey": "${keyPair.privateKey}",`}
                        >
                            {({ copied, copy }) => (
                                <ActionIcon
                                    color={copied ? 'teal' : 'blue'}
                                    onClick={copy}
                                    size="sm"
                                    variant="light"
                                >
                                    {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </Group>
                    <Code
                        block
                        p="sm"
                        style={{
                            fontSize: '11px',
                            lineHeight: 1.3
                        }}
                    >
                        {`"publicKey": "${keyPair.publicKey}",
"privateKey": "${keyPair.privateKey}",`}
                    </Code>
                </Stack>
            </Stack>
        </Stack>
    )
}
