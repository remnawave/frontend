import { Button, FileButton, Stack, Text, Textarea } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDownload, TbPlus, TbTrash, TbUpload } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { decodeVaultFile, isValidSeedPhrase, VAULT_FILE_EXTENSION } from '@entities/ssh-vault'

interface IProps {
    canExport: boolean
    hasVault: boolean
    onCreateNew: () => void
    onExport: () => Promise<Uint8Array>
    onImport: (file: Uint8Array, seedPhrase: string) => Promise<boolean>
    onReset: () => void
}

export const VaultManageScreen = (props: IProps) => {
    const { canExport, hasVault, onCreateNew, onExport, onImport, onReset } = props
    const { t } = useTranslation()

    const [backup, setBackup] = useState<null | { bytes: Uint8Array; createdAt: string }>(null)
    const [phrase, setPhrase] = useState('')
    const [error, setError] = useState<null | string>(null)
    const [isBusy, setIsBusy] = useState(false)
    const [confirmingReset, setConfirmingReset] = useState(false)

    const handleExport = async () => {
        setError(null)

        let data: Uint8Array
        try {
            data = await onExport()
        } catch {
            setError(t('node-ssh.export-locked'))
            return
        }

        const url = URL.createObjectURL(
            new Blob([data as BlobPart], { type: 'application/octet-stream' })
        )

        const link = document.createElement('a')
        link.href = url
        link.download = `rw-vault-${new Date().toISOString().slice(0, 10)}${VAULT_FILE_EXTENSION}`
        link.click()

        URL.revokeObjectURL(url)
    }

    const handleFile = async (file: File | null) => {
        setError(null)
        setBackup(null)

        if (!file) return

        try {
            const bytes = new Uint8Array(await file.arrayBuffer())
            setBackup({ bytes, createdAt: decodeVaultFile(bytes).createdAt })
        } catch {
            setError(t('node-ssh.import-invalid'))
        }
    }

    const handleImport = async () => {
        if (!backup) return

        setError(null)

        if (!isValidSeedPhrase(phrase)) {
            setError(t('node-ssh.seed-invalid'))
            return
        }

        setIsBusy(true)
        try {
            const restored = await onImport(backup.bytes, phrase)
            if (!restored) setError(t('node-ssh.import-mismatch'))
        } finally {
            setIsBusy(false)
        }
    }

    return (
        <Stack maw={520} mx="auto" w="100%">
            {hasVault && (
                <SectionCard.Root>
                    <SectionCard.Section>
                        <BaseOverlayHeader
                            iconColor="cyan"
                            IconComponent={TbDownload}
                            iconVariant="soft"
                            title={t('node-ssh.export')}
                            titleOrder={5}
                        />
                    </SectionCard.Section>
                    <SectionCard.Section>
                        <Text c="dimmed" size="sm">
                            {t('node-ssh.export-description')}
                        </Text>
                    </SectionCard.Section>
                    <SectionCard.Section>
                        <Stack gap="xs">
                            {!canExport && (
                                <Text c="dimmed" size="xs">
                                    {t('node-ssh.export-locked')}
                                </Text>
                            )}
                            <Button
                                disabled={!canExport}
                                fullWidth
                                leftSection={<TbDownload size={15} />}
                                onClick={() => void handleExport()}
                                size="sm"
                                variant="soft"
                            >
                                {t('common.action.download')}
                            </Button>
                        </Stack>
                    </SectionCard.Section>
                </SectionCard.Root>
            )}
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="cyan"
                        IconComponent={TbUpload}
                        iconVariant="soft"
                        title={t('node-ssh.import')}
                        titleOrder={5}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    <Text c="dimmed" size="sm">
                        {t('node-ssh.import-description')}
                    </Text>
                </SectionCard.Section>
                <SectionCard.Section>
                    <Stack gap="xs">
                        <Stack gap="xs" justify="end">
                            <FileButton
                                accept={VAULT_FILE_EXTENSION}
                                onChange={(file) => void handleFile(file)}
                            >
                                {(fileProps) => (
                                    <Button
                                        {...fileProps}
                                        leftSection={<TbUpload size={15} />}
                                        size="sm"
                                        variant="soft"
                                    >
                                        {t('node-ssh.import-select')}
                                    </Button>
                                )}
                            </FileButton>
                            {!hasVault && (
                                <Button
                                    leftSection={<TbPlus size={15} />}
                                    onClick={onCreateNew}
                                    size="sm"
                                    variant="soft"
                                    color="gray"
                                >
                                    {t('node-ssh.create-new-instead')}
                                </Button>
                            )}
                        </Stack>

                        {backup && (
                            <Stack gap="xs" mt={4}>
                                <Textarea
                                    autosize
                                    error={error}
                                    minRows={2}
                                    label={t('node-ssh.import-ready', {
                                        date: backup.createdAt.slice(0, 10)
                                    })}
                                    onChange={(event) => setPhrase(event.currentTarget.value)}
                                    placeholder="word1 word2 word3..."
                                    autoComplete="off"
                                    spellCheck={false}
                                    styles={{
                                        input: {
                                            fontFamily: 'var(--mantine-font-family-monospace)'
                                        }
                                    }}
                                    value={phrase}
                                />
                                <Button
                                    loading={isBusy}
                                    onClick={() => void handleImport()}
                                    size="sm"
                                >
                                    {t('node-ssh.import')}
                                </Button>
                            </Stack>
                        )}

                        {!backup && error && (
                            <Text c="red" size="xs">
                                {error}
                            </Text>
                        )}
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
            {hasVault && (
                <SectionCard.Root>
                    <SectionCard.Section>
                        <BaseOverlayHeader
                            iconColor="red"
                            IconComponent={TbTrash}
                            iconVariant="soft"
                            title={t('node-ssh.reset')}
                            titleOrder={5}
                        />
                    </SectionCard.Section>
                    <SectionCard.Section>
                        <Text c="dimmed" size="sm">
                            {t('node-ssh.reset-description')}
                        </Text>
                    </SectionCard.Section>
                    <SectionCard.Section>
                        <Button
                            color="red"
                            leftSection={<TbTrash size={15} />}
                            onClick={() => (confirmingReset ? onReset() : setConfirmingReset(true))}
                            size="sm"
                            fullWidth
                            variant={confirmingReset ? 'light' : 'soft'}
                        >
                            {confirmingReset ? t('node-ssh.reset-really') : t('node-ssh.reset')}
                        </Button>
                    </SectionCard.Section>
                </SectionCard.Root>
            )}
        </Stack>
    )
}
