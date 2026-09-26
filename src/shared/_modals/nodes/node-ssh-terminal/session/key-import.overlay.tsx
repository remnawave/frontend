import { Button, Group, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbKey, TbUpload } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { SshKeyError } from '@entities/ssh-vault'

import { TerminalOverlay } from '../window/terminal-overlay'

interface IProps {
    onClose: () => void
    onImport: (privateKey: string) => Promise<void>
}

export const KeyImportOverlay = (props: IProps) => {
    const { onClose, onImport } = props
    const { t } = useTranslation()

    const [privateKey, setPrivateKey] = useState('')
    const [error, setError] = useState<null | string>(null)
    const [isBusy, setIsBusy] = useState(false)

    const submit = async () => {
        setIsBusy(true)
        setError(null)

        try {
            await onImport(privateKey.trim())
            onClose()
        } catch (importError) {
            setError(
                t(
                    importError instanceof SshKeyError
                        ? `node-ssh.key-error.${importError.code}`
                        : 'node-ssh.key-error.malformed'
                )
            )
        } finally {
            setIsBusy(false)
        }
    }

    return (
        <TerminalOverlay onDismiss={onClose}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="cyan"
                        IconComponent={TbKey}
                        iconVariant="soft"
                        subtitle={t('node-ssh.key-import-description')}
                        title={t('node-ssh.key-import-title')}
                        titleOrder={5}
                    />
                </SectionCard.Section>

                <SectionCard.Section>
                    <Stack gap="sm">
                        <Textarea
                            autoFocus
                            autosize
                            error={error}
                            label={t('node-ssh.key-import-label')}
                            maxRows={8}
                            minRows={8}
                            ff="monospace"
                            onChange={(event) => setPrivateKey(event.currentTarget.value)}
                            placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                            autoComplete="off"
                            spellCheck={false}
                            styles={{
                                input: {
                                    fontSize: 10
                                }
                            }}
                            value={privateKey}
                        />
                    </Stack>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Group gap="xs" grow>
                        <Button color="gray" onClick={onClose} variant="light">
                            {t('common.action.cancel')}
                        </Button>
                        <Button
                            disabled={!privateKey.trim()}
                            leftSection={<TbUpload size={16} />}
                            loading={isBusy}
                            onClick={() => void submit()}
                            variant="soft"
                        >
                            {t('node-ssh.key-import')}
                        </Button>
                    </Group>
                </SectionCard.Section>
            </SectionCard.Root>
        </TerminalOverlay>
    )
}
