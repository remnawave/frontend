import {
    ActionIcon,
    Badge,
    Box,
    Button,
    CopyButton,
    Divider,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import {
    TbBrandGithub,
    TbBrandTelegram,
    TbCalendar,
    TbCheck,
    TbCopy,
    TbGitBranch,
    TbHash,
    TbServer,
    TbWorld
} from 'react-icons/tb'
import { GetMetadataCommand } from '@remnawave/backend-contract'

import { formatTimeUtil } from '@shared/utils/time-utils'

import { CopyableCodeBlock } from '../copyable-code-block'
import classes from './build-info-modal.module.css'
import { Logo } from '../logo'

interface BuildInfoModalProps {
    isNewVersionAvailable: boolean
    remnawaveMetadata: GetMetadataCommand.Response['response']
}

export function BuildInfoModal({ remnawaveMetadata, isNewVersionAvailable }: BuildInfoModalProps) {
    return (
        <Stack gap="md">
            {isNewVersionAvailable && (
                <Paper className={classes.updateCard} p="md" radius="md">
                    <Group align="center" gap="md" wrap="wrap">
                        <Group gap="sm" wrap="nowrap">
                            <Box className={classes.updateIconBox}>
                                <Logo color="var(--mantine-color-teal-4)" size={24} />
                            </Box>
                            <Stack className={classes.updateTextWrapper} gap={4}>
                                <Text c="teal.4" fw={600} size="sm">
                                    Update available
                                </Text>
                                <Text c="dimmed" size="xs">
                                    A new version is available
                                </Text>
                            </Stack>
                        </Group>

                        <Button
                            color="teal"
                            component="a"
                            href="https://t.me/remnalog"
                            leftSection={<TbBrandTelegram size={14} />}
                            ml="auto"
                            radius="md"
                            size="xs"
                            target="_blank"
                            variant="light"
                        >
                            Check out
                        </Button>
                    </Group>
                </Paper>
            )}

            <Paper className={classes.mainCard} p="md">
                <Stack gap="md">
                    <Group justify="space-between">
                        <Group gap="sm">
                            <Badge
                                color="cyan"
                                leftSection={<Logo size={16} />}
                                size="lg"
                                variant="light"
                            >
                                {remnawaveMetadata.version}
                            </Badge>

                            <Badge
                                color={
                                    remnawaveMetadata.git.backend.branch === 'dev' ? 'red' : 'teal'
                                }
                                leftSection={<TbGitBranch size={16} />}
                                size="lg"
                                variant="light"
                            >
                                {remnawaveMetadata.git.backend.branch}
                            </Badge>
                        </Group>
                        <CopyButton
                            timeout={2000}
                            value={JSON.stringify(remnawaveMetadata, null, 2)}
                        >
                            {({ copied, copy }) => (
                                <Tooltip label="Copy build info">
                                    <ActionIcon
                                        color={copied ? 'teal' : 'gray'}
                                        onClick={copy}
                                        size="md"
                                        variant="subtle"
                                    >
                                        {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Group>

                    <Divider className={classes.divider} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        <Paper className={classes.buildTimeCard} p="sm" radius="md">
                            <Group gap="xs" mb={6}>
                                <TbCalendar color="var(--mantine-color-indigo-5)" size={14} />
                                <Text c="indigo.5" fw={600} size="xs" tt="uppercase">
                                    Build Time
                                </Text>
                            </Group>
                            <Text c="gray.3" ff="monospace" size="xs">
                                {formatTimeUtil(
                                    remnawaveMetadata.build.time,
                                    'DD.MM.YYYY HH:mm:ss'
                                )}
                            </Text>
                        </Paper>

                        <Paper className={classes.buildNumberCard} p="sm" radius="md">
                            <Group gap="xs" mb={6}>
                                <TbHash color="var(--mantine-color-violet-5)" size={14} />
                                <Text c="violet.5" fw={600} size="xs" tt="uppercase">
                                    Build
                                </Text>
                            </Group>
                            <Text c="gray.3" ff="monospace" size="xs">
                                {remnawaveMetadata.build.number}
                            </Text>
                        </Paper>
                    </SimpleGrid>
                </Stack>
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <Paper className={classes.backendCard} p="md" radius="md">
                    <Stack gap="sm">
                        <Group gap="xs" justify="space-between">
                            <Group gap="xs">
                                <TbServer color="var(--mantine-color-teal-5)" size={16} />
                                <Text c="teal.5" fw={600} size="sm">
                                    Backend
                                </Text>
                            </Group>
                            <Tooltip label="View on GitHub">
                                <ActionIcon
                                    color="teal"
                                    component="a"
                                    href={remnawaveMetadata.git.backend.commitUrl}
                                    size="sm"
                                    target="_blank"
                                    variant="subtle"
                                >
                                    <TbBrandGithub size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <CopyableCodeBlock
                            size="small"
                            value={remnawaveMetadata.git.backend.commitSha}
                        />
                    </Stack>
                </Paper>

                <Paper className={classes.frontendCard} p="md" radius="md">
                    <Stack gap="sm">
                        <Group gap="xs" justify="space-between">
                            <Group gap="xs">
                                <TbWorld color="var(--mantine-color-cyan-5)" size={16} />
                                <Text c="cyan.5" fw={600} size="sm">
                                    Frontend
                                </Text>
                            </Group>
                            <Tooltip label="View on GitHub">
                                <ActionIcon
                                    color="cyan"
                                    component="a"
                                    href={remnawaveMetadata.git.frontend.commitUrl}
                                    size="sm"
                                    target="_blank"
                                    variant="subtle"
                                >
                                    <TbBrandGithub size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <CopyableCodeBlock
                            size="small"
                            value={remnawaveMetadata.git.frontend.commitSha}
                        />
                    </Stack>
                </Paper>
            </SimpleGrid>

            <Group gap="sm" grow>
                <Button
                    color="cyan"
                    component="a"
                    href="https://t.me/remnawave"
                    leftSection={<TbBrandTelegram size={16} />}
                    radius="md"
                    size="sm"
                    target="_blank"
                    variant="light"
                >
                    Community
                </Button>
                <Button
                    component="a"
                    href="https://github.com/remnawave"
                    leftSection={<TbBrandGithub size={16} />}
                    radius="md"
                    size="sm"
                    target="_blank"
                    variant="default"
                >
                    GitHub
                </Button>
            </Group>
        </Stack>
    )
}
