import { ActionIcon, Anchor, Popover, Stack, Text } from '@mantine/core'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { HiQuestionMarkCircle } from 'react-icons/hi'

export function HelpPopover(props: { children: ReactNode; docsUrl?: string }) {
    const { children, docsUrl } = props
    const { t } = useTranslation()

    return (
        <Popover position="top" shadow="md" width={300} withArrow>
            <Popover.Target>
                <ActionIcon
                    aria-label={t('common.action.documentation')}
                    color="gray"
                    size="xs"
                    variant="subtle"
                >
                    <HiQuestionMarkCircle aria-hidden size={18} />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap="sm">
                    {children}

                    {docsUrl && (
                        <Anchor href={docsUrl} rel="noreferrer" size="sm" target="_blank">
                            {t('common.action.documentation')}
                        </Anchor>
                    )}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}

export function DocsHelp(props: { url: string }) {
    const { url } = props
    const { t } = useTranslation()

    return (
        <ActionIcon
            aria-label={t('common.action.documentation')}
            color="gray"
            component="a"
            href={url}
            rel="noreferrer"
            size="xs"
            target="_blank"
            variant="subtle"
        >
            <HiQuestionMarkCircle aria-hidden size={18} />
        </ActionIcon>
    )
}

export function DimmedText(props: { children: ReactNode }) {
    return (
        <Text c="dimmed" size="sm">
            {props.children}
        </Text>
    )
}
