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
                mb="lg"
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
            >
                <Stack gap="sm">
                    <Group align="flex-start" justify="space-between">
                        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                            <XtlsLogo size={24} />
                            <Title
                                c="white"
                                lineClamp={2}
                                order={4}
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
                                leftSection={<PiCpu size={12} />}
                                size="sm"
                                variant="light"
                            >
                                {configProfile.nodes.length}
                            </Badge>
                        </Tooltip>
                    </Group>

                    {/* UUID and XTLS row */}
                    <Group gap="xs">
                        <Group
                            gap="xs"
                            style={{
                                backgroundColor: 'rgba(30, 41, 59, 0.3)',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(148, 163, 184, 0.1)',
                                flex: 1,
                                minWidth: 0
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
                                        {copied ? <PiCheck size={10} /> : <PiCopy size={10} />}
                                    </ActionIcon>
                                )}
                            </CopyButton>
                        </Group>
                    </Group>
                </Stack>
            </Paper>
        )
    }

    return (
        <Paper
            mb="lg"
            p="xl"
            radius="lg"
            shadow="md"
            style={{
                background: `
                    linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.98) 0%,
                        rgba(30, 41, 59, 0.98) 50%,
                        rgba(15, 23, 42, 0.98) 100%
                    )
                `,
                border: '1px solid rgba(148, 163, 184, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Group
                align="center"
                gap="lg"
                style={{ position: 'relative', zIndex: 1 }}
                wrap="nowrap"
            >
                <ThemeIcon
                    radius="lg"
                    size={60}
                    style={{
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.1)'
                    }}
                    variant="outline"
                >
                    <XtlsLogo size="1.8rem" />
                </ThemeIcon>

                <Stack gap="sm" style={{ flex: 1, minWidth: 0 }}>
                    <Title
                        c="white"
                        lineClamp={2}
                        order={2}
                        style={{
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        {configProfile.name}
                    </Title>

                    <Group align="center" gap="sm">
                        <Tooltip
                            label={t('config-profile-detail-header.widget.active-nodes')}
                            position="left"
                        >
                            <Badge
                                color={configProfile.nodes.length > 0 ? 'teal' : 'red'}
                                leftSection={<PiCpu size={16} />}
                                size="xl"
                                style={{
                                    boxShadow:
                                        configProfile.nodes.length > 0
                                            ? '0 4px 15px rgba(16, 185, 129, 0.2)'
                                            : '0 4px 15px rgba(239, 68, 68, 0.2)',
                                    border:
                                        configProfile.nodes.length > 0
                                            ? '1px solid rgba(16, 185, 129, 0.3)'
                                            : '1px solid rgba(239, 68, 68, 0.3)',
                                    fontWeight: 600
                                }}
                                variant="light"
                            >
                                {configProfile.nodes.length}
                            </Badge>
                        </Tooltip>

                        <Group
                            gap={4}
                            style={{
                                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(148, 163, 184, 0.1)'
                            }}
                        >
                            <Text c="gray.4" ff="monospace" size="xs" truncate>
                                {configProfile.uuid}
                            </Text>
                            <CopyButton timeout={2000} value={configProfile.uuid}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                        <ActionIcon
                                            color={copied ? 'teal' : 'gray'}
                                            onClick={copy}
                                            size="xs"
                                            style={{
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(148, 163, 184, 0.1)'
                                                }
                                            }}
                                            variant="subtle"
                                        >
                                            {copied ? <PiCheck size={12} /> : <PiCopy size={12} />}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </Group>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    )
}
