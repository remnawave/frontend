import type { ISshHostKeyPrompt } from './ssh-connection'

import { ActionIcon, Box, Button, CopyButton, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbCheck, TbCopy, TbFingerprint } from 'react-icons/tb'

import { SectionCard } from '@shared/ui/section-card'

import classes from '../NodeSshTerminal.module.css'
import { TerminalOverlay } from '../window/terminal-overlay'

interface IProps {
    onAbort: () => void
    onTrust: () => void
    prompt: ISshHostKeyPrompt
}

const Fingerprint = (props: { color?: string; label: string; value: string }) => (
    <Stack gap={4}>
        <Text c="dimmed" size="xs">
            {props.label}
        </Text>
        <CopyButton timeout={2000} value={props.value}>
            {({ copied, copy }) => (
                <Box className={classes.fingerprint} onClick={copy}>
                    <Text c={props.color} className={classes.fingerprintValue}>
                        {props.value}
                    </Text>
                    <ActionIcon c={copied ? 'teal' : 'dimmed'} size="sm" variant="transparent">
                        {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                    </ActionIcon>
                </Box>
            )}
        </CopyButton>
    </Stack>
)

export const HostKeyOverlay = (props: IProps) => {
    const { onAbort, onTrust, prompt } = props
    const { t } = useTranslation()

    const changed = prompt.knownFingerprint !== null

    return (
        <TerminalOverlay maxWidth={460}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <Group align="flex-start" gap="sm" wrap="nowrap">
                        <ThemeIcon
                            color={changed ? 'red' : 'orange'}
                            radius="md"
                            size={38}
                            variant="soft"
                        >
                            {changed ? <TbAlertTriangle size={20} /> : <TbFingerprint size={20} />}
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text fw={600} size="sm">
                                {changed
                                    ? t('node-ssh.hostkey-changed-title')
                                    : t('node-ssh.hostkey-new-title')}
                            </Text>
                            <Text c="dimmed" size="xs">
                                {changed
                                    ? t('node-ssh.hostkey-changed-description')
                                    : t('node-ssh.hostkey-new-description')}
                            </Text>
                        </Stack>
                    </Group>
                </SectionCard.Section>
                <SectionCard.Section>
                    <Stack gap="xs">
                        <Text c="dimmed" ff="monospace" size="xs" ta="center">
                            {prompt.target} · {prompt.algo}
                        </Text>

                        <Fingerprint label={t('node-ssh.fingerprint')} value={prompt.fingerprint} />

                        {changed && prompt.knownFingerprint && (
                            <Fingerprint
                                color="red.4"
                                label={t('node-ssh.known-fingerprint')}
                                value={prompt.knownFingerprint}
                            />
                        )}
                    </Stack>
                </SectionCard.Section>
                <SectionCard.Section>
                    <Group gap="xs" grow>
                        <Button color="gray" onClick={onAbort} variant="light">
                            {t('node-ssh.abort')}
                        </Button>
                        <Button color={changed ? 'red' : 'blue'} onClick={onTrust} variant="soft">
                            {t('node-ssh.trust-and-connect')}
                        </Button>
                    </Group>
                </SectionCard.Section>
            </SectionCard.Root>
        </TerminalOverlay>
    )
}
