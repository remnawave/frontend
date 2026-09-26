import { ActionIcon, Button, Group, Scroller, Text, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPlus } from 'react-icons/tb'

import type { ISshSnippet } from '@entities/ssh-vault'

import classes from '../NodeSshTerminal.module.css'

interface IProps {
    onManage: () => void
    onRun: (snippet: ISshSnippet) => void
    snippets: ISshSnippet[]
}

export const SnippetsBar = (props: IProps) => {
    const { onManage, onRun, snippets } = props
    const { t } = useTranslation()

    return (
        <Scroller className={classes.snippetsBar} draggable>
            <Group gap="xs" p={6} wrap="nowrap">
                <ActionIcon color="gray" onClick={onManage} size="md" variant="subtle">
                    <TbPlus size={16} />
                </ActionIcon>

                {snippets.length === 0 ? (
                    <Text c="dimmed" size="xs">
                        {t('node-ssh.snippets-empty')}
                    </Text>
                ) : (
                    snippets.map((snippet) => (
                        <Tooltip
                            key={snippet.id}
                            label={
                                <Text ff="monospace" size="xs" style={{ whiteSpace: 'pre-wrap' }}>
                                    {snippet.command}
                                </Text>
                            }
                            multiline
                            maw={420}
                            zIndex={600}
                            withArrow
                        >
                            <Button
                                color="gray"
                                onClick={() => onRun(snippet)}
                                size="compact-sm"
                                variant="light"
                            >
                                {snippet.name}
                            </Button>
                        </Tooltip>
                    ))
                )}
            </Group>
        </Scroller>
    )
}
