import { Box, Button, CopyButton, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowRight, TbCheck, TbCopy, TbLock, TbShieldLock } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { generateSeedPhrase } from '@entities/ssh-vault'

import classes from '../NodeSshTerminal.module.css'
import { PasscodeForm } from './passcode-form'

interface IProps {
    onComplete: (seedPhrase: string, passcode: string) => Promise<void>
}

export const VaultSetupScreen = (props: IProps) => {
    const { onComplete } = props
    const { t } = useTranslation()

    const seedPhrase = useMemo(() => generateSeedPhrase(), [])
    const words = useMemo(() => seedPhrase.split(' '), [seedPhrase])

    const [step, setStep] = useState(0)

    return (
        <SectionCard.Root maw={520} mx="auto" w="100%">
            <SectionCard.Section>
                {step === 0 && (
                    <BaseOverlayHeader
                        iconColor="orange"
                        IconComponent={TbShieldLock}
                        iconVariant="soft"
                        subtitle={t('node-ssh.seed-warning')}
                        title={t('node-ssh.vault-setup-title')}
                        titleOrder={5}
                    />
                )}

                {step === 1 && (
                    <BaseOverlayHeader
                        iconColor="blue"
                        IconComponent={TbLock}
                        iconVariant="soft"
                        subtitle={t('node-ssh.passcode-description')}
                        title={t('node-ssh.passcode-title')}
                        titleOrder={5}
                    />
                )}
            </SectionCard.Section>
            <SectionCard.Section>
                {step === 0 && (
                    <Stack gap="md">
                        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={8}>
                            {words.map((word, index) => (
                                <Box className={classes.wordChip} key={`${word}-${index}`}>
                                    <Text c="dimmed" ff="monospace" size="xs" w={14}>
                                        {index + 1}
                                    </Text>
                                    <Text ff="monospace" fw={600} size="sm">
                                        {word}
                                    </Text>
                                </Box>
                            ))}
                        </SimpleGrid>

                        <Group gap="sm" w="100%" justify="center" wrap="nowrap">
                            <CopyButton value={seedPhrase}>
                                {({ copied, copy }) => (
                                    <Button
                                        color={copied ? 'teal' : 'gray'}
                                        leftSection={
                                            copied ? <TbCheck size={16} /> : <TbCopy size={16} />
                                        }
                                        onClick={copy}
                                        variant="subtle"
                                        style={{ flex: 1 }}
                                    >
                                        {t('common.action.copy')}
                                    </Button>
                                )}
                            </CopyButton>
                            <Button
                                variant="soft"
                                onClick={() => setStep(1)}
                                style={{ flex: 1 }}
                                rightSection={<TbArrowRight size={16} />}
                            >
                                {t('common.action.continue')}
                            </Button>
                        </Group>
                    </Stack>
                )}

                {step === 1 && (
                    <PasscodeForm
                        onSubmit={(passcode) => onComplete(seedPhrase, passcode)}
                        submitLabel={t('node-ssh.create-vault')}
                    />
                )}
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
