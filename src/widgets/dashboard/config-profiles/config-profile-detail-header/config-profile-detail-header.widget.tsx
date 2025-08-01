import {
    ActionIcon,
    Badge,
    CopyButton,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import { PiCheck, PiCopy, PiCpu } from 'react-icons/pi'
import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'

import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import { IProps } from './interfaces/props.interface'

export const ConfigProfileDetailHeaderWidget = (props: IProps) => {
    const { configProfile } = props
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 48em)')

    if (isMobile) {
        return (
            <Paper
                mb="md"
                p="xs"
                radius="md"
                shadow="sm"
                style={{
                    background: `
                        linear-gradient(135deg, 
                            rgba(15, 23, 42, 0.95) 0%,
                            rgba(30, 41, 59, 0.95) 100%
                        )
                    `,
                    border: '1px solid rgba(148, 163, 184, 0.1)'
                }}
                w="fit-content"
            >
                <Stack gap="xs">
                    <Group align="flex-start" justify="space-between">
                        <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                            <XtlsLogo size={20} />
                            <Title
                                c="white"
                                lineClamp={2}
                                order={5}
                                style={{ flex: 1, minWidth: 0 }}
                            >
                                {configProfile.name}
                            </Title>
                        </Group>

                        <Tooltip
                            label={t('config-profile-detail-header.widget.active-nodes')}
                            position="left"
                        >
                            <Badge
                                color={configProfile.nodes.length > 0 ? 'teal' : 'red'}
                                leftSection={<PiCpu size={10} />}
                                size="xs"
                                variant="light"
                            >
                                {configProfile.nodes.length}
                            </Badge>
                        </Tooltip>
                    </Group>

                    <Group
                        gap="xs"
                        style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.3)',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            border: '1px solid rgba(148, 163, 184, 0.1)'
                        }}
                    >
                        <Text c="gray.4" ff="monospace" size="xs" style={{ flex: 1 }} truncate>
                            {configProfile.uuid}
                        </Text>
                        <CopyButton timeout={2000} value={configProfile.uuid}>
                            {({ copied, copy }) => (
                                <ActionIcon
                                    color={copied ? 'teal' : 'gray'}
                                    onClick={copy}
                                    size="xs"
                                    variant="subtle"
                                >
                                    {copied ? <PiCheck size={8} /> : <PiCopy size={8} />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </Group>
                </Stack>
            </Paper>
        )
    }

    return (
        <Paper
            mb="md"
            p="md"
            radius="md"
            shadow="sm"
            style={{
                background: `
                    linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.95) 0%,
                        rgba(30, 41, 59, 0.95) 100%
                    )
                `,
                border: '1px solid rgba(148, 163, 184, 0.1)'
            }}
            w="fit-content"
        >
            <Group align="center" gap="md" wrap="nowrap">
                <ThemeIcon
                    radius="md"
                    size={40}
                    style={{
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    variant="outline"
                >
                    <XtlsLogo size="1.2rem" />
                </ThemeIcon>

                <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
                    <Title c="white" lineClamp={1} order={3}>
                        {configProfile.name}
                    </Title>

                    <Group align="center" gap="sm">
                        <Tooltip
                            label={t('config-profile-detail-header.widget.active-nodes')}
                            position="bottom"
                        >
                            <Badge
                                color={configProfile.nodes.length > 0 ? 'teal' : 'red'}
                                leftSection={<PiCpu size={12} />}
                                size="sm"
                                variant="light"
                            >
                                {configProfile.nodes.length}
                            </Badge>
                        </Tooltip>

                        <Group
                            gap={4}
                            style={{
                                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(148, 163, 184, 0.1)'
                            }}
                        >
                            <Text c="gray.4" ff="monospace" size="xs" truncate>
                                {configProfile.uuid}
                            </Text>
                            <CopyButton timeout={2000} value={configProfile.uuid}>
                                {({ copied, copy }) => (
                                    <ActionIcon
                                        color={copied ? 'teal' : 'gray'}
                                        onClick={copy}
                                        size="xs"
                                        variant="subtle"
                                    >
                                        {copied ? <PiCheck size={10} /> : <PiCopy size={10} />}
                                    </ActionIcon>
                                )}
                            </CopyButton>
                        </Group>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    )
}
