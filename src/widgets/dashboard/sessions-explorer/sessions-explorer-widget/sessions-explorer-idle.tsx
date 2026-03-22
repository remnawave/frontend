import { TbAlertTriangle, TbBrandDocker, TbClock, TbRadar, TbRadar2 } from 'react-icons/tb'
import { Button, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { CodeHighlight } from '@mantine/code-highlight'
import { Trans, useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

const DOCKER_SNIPPET = `
    cap_add:
      - NET_ADMIN
`

const HIGHLIGHT_SPAN = <Text c="white" component="span" fw={600} size="sm" />

interface IProps {
    onlineNodesCount: number
    onStart: () => void
}

export function SessionsExplorerIdle({ onlineNodesCount, onStart }: IProps) {
    const { t } = useTranslation()

    return (
        <Stack gap="md">
            <SectionCard.Root gap="md">
                <SectionCard.Section>
                    <BaseOverlayHeader
                        iconColor="yellow"
                        IconComponent={TbAlertTriangle}
                        iconVariant="soft"
                        title={t('active-sessions-drawer.widget.requirements')}
                    />
                </SectionCard.Section>

                <Stack gap="xs">
                    <Group gap="sm" wrap="nowrap">
                        <ThemeIcon color="violet" size="md" variant="soft">
                            <TbBrandDocker size={16} />
                        </ThemeIcon>
                        <Text c="dimmed" size="sm">
                            <Trans
                                components={{ highlight: HIGHLIGHT_SPAN }}
                                i18nKey="active-sessions-drawer.widget.warning-docker"
                            />
                        </Text>
                    </Group>
                    <CodeHighlight
                        background="rgba(22, 27, 35)"
                        code={DOCKER_SNIPPET}
                        language="yaml"
                        radius="md"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: 'var(--mantine-radius-md)'
                        }}
                    />
                </Stack>

                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon color="cyan" size="md" variant="soft">
                        <TbClock size={16} />
                    </ThemeIcon>
                    <Text c="dimmed" size="sm">
                        <Trans
                            components={{ highlight: HIGHLIGHT_SPAN }}
                            i18nKey="active-sessions-drawer.widget.warning-activity"
                        />
                    </Text>
                </Group>

                <Group gap="sm" wrap="nowrap">
                    <ThemeIcon color="yellow" size="md" variant="soft">
                        <TbRadar size={16} />
                    </ThemeIcon>
                    <Text c="dimmed" size="sm">
                        {t('sessions-explorer-idle.description-1')}
                    </Text>
                </Group>
            </SectionCard.Root>

            <Button
                color="teal"
                disabled={onlineNodesCount === 0}
                fullWidth
                leftSection={<TbRadar2 size={20} />}
                onClick={onStart}
                size="md"
                variant="light"
            >
                {t('sessions-explorer-idle.start-exploring')}
            </Button>
        </Stack>
    )
}
