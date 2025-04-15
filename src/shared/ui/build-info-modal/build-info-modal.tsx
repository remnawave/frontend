import {
    TbBrandGithub as IconBrandGithub,
    TbBrandTelegram as IconBrandTelegram,
    TbCalendar as IconCalendar,
    TbCheck as IconCheck,
    TbCopy as IconCopy,
    TbGitBranch,
    TbHash
} from 'react-icons/tb'
import {
    Badge,
    Box,
    Button,
    Card,
    Code,
    Divider,
    Flex,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip,
    useMantineTheme
} from '@mantine/core'
import { useClipboard } from '@mantine/hooks'

import { IBuildInfo } from '@shared/utils/get-build-info/interfaces/build-info.interface'

import { Logo } from '../logo'

interface BuildInfoModalProps {
    buildInfo: IBuildInfo
    isNewVersionAvailable: boolean
    onClose: () => void
    opened: boolean
}

export function BuildInfoModal({
    opened,
    onClose,
    buildInfo,
    isNewVersionAvailable
}: BuildInfoModalProps) {
    const buildDate = new Date(buildInfo.buildTime).toLocaleString()
    const clipboard = useClipboard({ timeout: 1000 })
    const theme = useMantineTheme()

    const copyBuildInfo = () => {
        clipboard.copy(JSON.stringify(buildInfo, null, 2))
    }

    return (
        <Modal
            centered
            onClose={onClose}
            opened={opened}
            padding="xl"
            radius="lg"
            title={
                <Group justify="space-between" w="100%">
                    <Title c={theme.primaryColor} fw={700} order={3}>
                        Build Info
                    </Title>
                    <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy build info'}>
                        <Button
                            color={clipboard.copied ? 'green' : 'gray'}
                            leftSection={
                                clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                            }
                            onClick={copyBuildInfo}
                            radius="xl"
                            size="compact-sm"
                            variant="light"
                        >
                            Copy
                        </Button>
                    </Tooltip>
                </Group>
            }
            withCloseButton
        >
            <Stack gap="xl">
                {isNewVersionAvailable && (
                    <Paper
                        bg="rgba(0, 180, 160, 0.05)"
                        p="lg"
                        radius="lg"
                        style={{ border: `1px solid ${theme.colors.teal[3]}` }}
                        withBorder
                    >
                        <Group align="flex-start" gap="md">
                            <ThemeIcon color="cyan" radius="xl" size={48} variant="outline">
                                <Logo size={24} />
                            </ThemeIcon>
                            <Stack gap="xs" style={{ flex: 1 }}>
                                <Text c="teal.5" fw={700} size="md">
                                    Update available
                                </Text>
                                <Text c="dimmed" size="md">
                                    A new version is available.
                                </Text>
                                <Button
                                    color="teal"
                                    component="a"
                                    fullWidth={false}
                                    href={'https://github.com/remnawave/panel/releases/latest'}
                                    leftSection={<IconBrandGithub size={16} />}
                                    mt="sm"
                                    radius="md"
                                    size="sm"
                                    style={{ alignSelf: 'flex-start' }}
                                    target="_blank"
                                    variant="light"
                                >
                                    Check out
                                </Button>
                            </Stack>
                        </Group>
                    </Paper>
                )}

                <Card padding="lg" radius="lg" shadow="sm" withBorder>
                    <Stack gap="lg">
                        <Group align="center" gap="lg">
                            <ThemeIcon
                                color={theme.primaryColor}
                                radius="xl"
                                size={48}
                                style={{
                                    border: `1px solid ${theme.colors[theme.primaryColor][5]}`
                                }}
                                variant="light"
                            >
                                <IconCalendar size={24} />
                            </ThemeIcon>
                            <Box style={{ flex: 1 }}>
                                <Text fw={700} size="md">
                                    Build Time
                                </Text>
                                <Text c="dimmed" mt={4} size="sm">
                                    {buildDate}
                                </Text>
                            </Box>
                        </Group>

                        <Divider variant="dashed" />

                        <Group align="center" gap="lg">
                            <ThemeIcon
                                color={theme.primaryColor}
                                radius="xl"
                                size={48}
                                style={{
                                    border: `1px solid ${theme.colors[theme.primaryColor][5]}`
                                }}
                                variant="light"
                            >
                                <TbGitBranch size={24} />
                            </ThemeIcon>
                            <Box style={{ flex: 1 }}>
                                <Text fw={700} size="md">
                                    Branch
                                </Text>
                                <Flex gap="xs" mt={6}>
                                    <Badge
                                        color="blue"
                                        px="md"
                                        radius="xl"
                                        size="lg"
                                        variant="light"
                                    >
                                        {buildInfo.branch}
                                    </Badge>
                                    {buildInfo.tag && (
                                        <Badge
                                            color="green"
                                            px="md"
                                            radius="xl"
                                            size="lg"
                                            variant="light"
                                        >
                                            {buildInfo.tag}
                                        </Badge>
                                    )}
                                </Flex>
                            </Box>
                        </Group>

                        <Divider variant="dashed" />

                        <Group align="center" gap="lg">
                            <ThemeIcon
                                color={theme.primaryColor}
                                radius="xl"
                                size={48}
                                style={{
                                    border: `1px solid ${theme.colors[theme.primaryColor][5]}`
                                }}
                                variant="light"
                            >
                                <TbHash size={24} />
                            </ThemeIcon>
                            <Box style={{ flex: 1 }}>
                                <Text fw={700} size="md">
                                    Commit
                                </Text>
                                <Code fz={'sm'}>{buildInfo.commit}</Code>
                            </Box>
                        </Group>
                    </Stack>
                </Card>

                <Group gap="md" grow preventGrowOverflow={false} wrap="wrap">
                    <Button
                        component="a"
                        href={buildInfo.commitUrl}
                        leftSection={<IconBrandGithub size={18} />}
                        radius="md"
                        size="md"
                        target="_blank"
                        variant="outline"
                    >
                        View on GitHub
                    </Button>

                    <Button
                        color="cyan"
                        component="a"
                        href={'https://t.me/remnawave'}
                        leftSection={<IconBrandTelegram size={18} />}
                        radius="md"
                        size="md"
                        target="_blank"
                        variant="light"
                    >
                        Ask Community
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
