import {
    ActionIcon,
    Box,
    Button,
    Group,
    Stack,
    Text,
    Textarea,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbBolt, TbDeviceFloppy, TbPlus, TbTrash } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import type { ISshSnippet } from '@entities/ssh-vault'

import classes from './NodeSshTerminal.module.css'

interface IProps {
    onClose: () => void
    onDelete: (id: string) => Promise<void>
    onSave: (snippet: { command: string; id?: string; name: string }) => Promise<void>
    snippets: ISshSnippet[]
}

type TDraft = { command: string; id?: string; name: string }

export const SnippetsOverlay = (props: IProps) => {
    const { onClose, onDelete, onSave, snippets } = props
    const { t } = useTranslation()

    const [draft, setDraft] = useState<null | TDraft>(null)
    const [isBusy, setIsBusy] = useState(false)

    const isReady = Boolean(draft?.name.trim() && draft?.command.trim())

    const save = async () => {
        if (!draft) return

        setIsBusy(true)
        try {
            await onSave({
                command: draft.command.trim(),
                id: draft.id,
                name: draft.name.trim()
            })
            setDraft(null)
        } finally {
            setIsBusy(false)
        }
    }

    return (
        <motion.div
            animate={{ opacity: 1 }}
            className={classes.overlay}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
        >
            <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 4 }}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                style={{ maxWidth: 520, width: '100%' }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
                <SectionCard.Root>
                    <SectionCard.Section>
                        <BaseOverlayHeader
                            iconColor="cyan"
                            IconComponent={TbBolt}
                            iconVariant="soft"
                            title={
                                draft
                                    ? draft.id
                                        ? t('node-ssh.snippet-edit')
                                        : t('node-ssh.snippet-add')
                                    : t('node-ssh.snippets-title')
                            }
                            titleOrder={5}
                        />
                    </SectionCard.Section>

                    {draft ? (
                        <>
                            <SectionCard.Section>
                                <Stack gap="sm">
                                    <TextInput
                                        autoFocus
                                        label={t('node-ssh.snippet-name')}
                                        onChange={(event) =>
                                            setDraft({ ...draft, name: event.currentTarget.value })
                                        }
                                        placeholder="Docker Stats"
                                        value={draft.name}
                                    />
                                    <Textarea
                                        autosize
                                        label={t('node-ssh.snippet-command')}
                                        maxRows={8}
                                        minRows={3}
                                        onChange={(event) =>
                                            setDraft({
                                                ...draft,
                                                command: event.currentTarget.value
                                            })
                                        }
                                        placeholder="docker stats"
                                        spellCheck={false}
                                        styles={{
                                            input: {
                                                fontFamily: 'var(--mantine-font-family-monospace)'
                                            }
                                        }}
                                        value={draft.command}
                                    />
                                </Stack>
                            </SectionCard.Section>
                            <SectionCard.Section>
                                <Group gap="xs" grow>
                                    <Button
                                        color="gray"
                                        onClick={() => setDraft(null)}
                                        variant="light"
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button
                                        disabled={!isReady}
                                        leftSection={<TbDeviceFloppy size={16} />}
                                        loading={isBusy}
                                        onClick={() => void save()}
                                        variant="soft"
                                    >
                                        {t('common.save')}
                                    </Button>
                                </Group>
                            </SectionCard.Section>
                        </>
                    ) : (
                        <>
                            <SectionCard.Section>
                                {snippets.length === 0 ? (
                                    <Stack align="center" gap={6} py="lg">
                                        <ThemeIcon
                                            color="gray"
                                            radius="md"
                                            size={38}
                                            variant="soft"
                                        >
                                            <TbBolt size={20} />
                                        </ThemeIcon>
                                        <Text c="dimmed" size="sm" ta="center">
                                            {t('node-ssh.snippets-empty')}
                                        </Text>
                                    </Stack>
                                ) : (
                                    <Box className={classes.snippetList}>
                                        <Stack gap={4}>
                                            {snippets.map((snippet) => (
                                                <Group
                                                    className={classes.snippetRow}
                                                    gap="xs"
                                                    key={snippet.id}
                                                    onClick={() => setDraft({ ...snippet })}
                                                    wrap="nowrap"
                                                >
                                                    <Box flex={1} miw={0}>
                                                        <Text size="sm" truncate>
                                                            {snippet.name}
                                                        </Text>
                                                        <Text
                                                            c="dimmed"
                                                            ff="monospace"
                                                            size="xs"
                                                            truncate
                                                        >
                                                            {snippet.command.split('\n')[0]}
                                                        </Text>
                                                    </Box>
                                                    <ActionIcon
                                                        className={classes.snippetDelete}
                                                        color="red"
                                                        ml="auto"
                                                        onClick={(event) => {
                                                            event.stopPropagation()
                                                            void onDelete(snippet.id)
                                                        }}
                                                        size="sm"
                                                        variant="subtle"
                                                    >
                                                        <TbTrash size={14} />
                                                    </ActionIcon>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </SectionCard.Section>
                            <SectionCard.Section>
                                <Group gap="xs" grow>
                                    <Button color="gray" onClick={onClose} variant="light">
                                        {t('common.close')}
                                    </Button>
                                    <Button
                                        leftSection={<TbPlus size={16} />}
                                        onClick={() => setDraft({ command: '', name: '' })}
                                        variant="soft"
                                    >
                                        {t('node-ssh.snippet-add')}
                                    </Button>
                                </Group>
                            </SectionCard.Section>
                        </>
                    )}
                </SectionCard.Root>
            </motion.div>
        </motion.div>
    )
}
