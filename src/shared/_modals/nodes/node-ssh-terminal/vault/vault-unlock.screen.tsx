import { Alert, Anchor, Button, Group, Stack, Text, Textarea } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbBook, TbLock, TbLockOpen } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { describeVaultError, isValidSeedPhrase } from '@entities/ssh-vault'

import { PasscodeInput } from './passcode-input'

interface IProps {
    attemptsLeft: number
    hasPasscode: boolean
    onReset: () => void
    passcodeLength: number
    onUnlockWithPhrase: (seedPhrase: string) => Promise<boolean>
    onUnlockWithPasscode: (passcode: string) => Promise<boolean>
}

export const VaultUnlockScreen = (props: IProps) => {
    const {
        attemptsLeft,
        hasPasscode,
        onReset,
        passcodeLength,
        onUnlockWithPhrase,
        onUnlockWithPasscode
    } = props
    const { t } = useTranslation()

    const [usePhrase, setUsePhrase] = useState(!hasPasscode)
    const [passcode, setPasscode] = useState('')
    const [phrase, setPhrase] = useState('')
    const [passcodeError, setPasscodeError] = useState<null | string>(null)
    const [didSpendAttempt, setDidSpendAttempt] = useState(false)
    const [phraseError, setPhraseError] = useState<null | string>(null)
    const [isBusy, setIsBusy] = useState(false)

    const submitPasscode = async (value: string) => {
        setPasscodeError(null)
        setDidSpendAttempt(false)
        setIsBusy(true)

        try {
            const unlocked = await onUnlockWithPasscode(value)
            if (!unlocked) {
                setPasscode('')
                setPasscodeError(t('node-ssh.passcode-wrong'))
                setDidSpendAttempt(true)
            }
        } catch (error) {
            setPasscode('')
            setPasscodeError(describeVaultError(error))
        } finally {
            setIsBusy(false)
        }
    }

    const submitPhrase = async () => {
        setPhraseError(null)

        if (!isValidSeedPhrase(phrase)) {
            setPhraseError(t('node-ssh.seed-invalid'))
            return
        }

        setIsBusy(true)
        try {
            const unlocked = await onUnlockWithPhrase(phrase)
            if (!unlocked) setPhraseError(t('node-ssh.seed-mismatch'))
        } catch (error) {
            setPhraseError(describeVaultError(error))
        } finally {
            setIsBusy(false)
        }
    }

    if (!usePhrase && hasPasscode) {
        return (
            <SectionCard.Root maw={450} mx="auto" w="100%">
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="blue"
                        IconComponent={TbLock}
                        iconVariant="soft"
                        subtitle={t('node-ssh.passcode-unlock-description')}
                        title={t('node-ssh.vault-unlock-title')}
                        titleOrder={5}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    <Stack align="center" gap="md">
                        <PasscodeInput
                            autoFocus
                            disabled={isBusy}
                            error={Boolean(passcodeError)}
                            length={passcodeLength}
                            onChange={setPasscode}
                            onComplete={(value) => void submitPasscode(value)}
                            value={passcode}
                        />

                        {passcodeError && (
                            <Text c="red" size="xs" ta="center">
                                {passcodeError}
                                {didSpendAttempt &&
                                    ` · ${t('node-ssh.passcode-attempts', { count: attemptsLeft })}`}
                            </Text>
                        )}

                        <Anchor c="dimmed" onClick={() => setUsePhrase(true)} size="xs">
                            {t('node-ssh.use-phrase')}
                        </Anchor>
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    return (
        <SectionCard.Root maw={450} mx="auto" w="100%">
            <SectionCard.Section>
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbBook}
                    iconVariant="soft"
                    subtitle={t('node-ssh.unlock-description')}
                    title={t('node-ssh.vault-unlock-title')}
                    titleOrder={5}
                />
            </SectionCard.Section>
            <SectionCard.Section>
                <Stack gap="xs">
                    {!hasPasscode && attemptsLeft === 0 && (
                        <Alert icon={<TbAlertTriangle size={18} />} variant="default">
                            <Text size="xs">{t('node-ssh.passcode-exhausted')}</Text>
                        </Alert>
                    )}

                    <Textarea
                        autosize
                        error={phraseError}
                        minRows={3}
                        onChange={(event) => setPhrase(event.currentTarget.value)}
                        placeholder="word1 word2 word3..."
                        autoComplete="off"
                        spellCheck={false}
                        styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }}
                        value={phrase}
                    />

                    <Button
                        fullWidth
                        leftSection={<TbLockOpen size={16} />}
                        loading={isBusy}
                        variant="soft"
                        onClick={() => void submitPhrase()}
                    >
                        {t('node-ssh.unlock')}
                    </Button>

                    <Group gap="lg" justify="center">
                        {hasPasscode && (
                            <Anchor c="dimmed" onClick={() => setUsePhrase(false)} size="xs">
                                {t('node-ssh.use-passcode')}
                            </Anchor>
                        )}
                        <Anchor c="dimmed" onClick={onReset} size="xs">
                            {t('node-ssh.lost-everything')}
                        </Anchor>
                    </Group>
                </Stack>
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
