import {
    IconBrandGithub,
    IconBrandTelegram,
    IconCalendar,
    IconCheck,
    IconCopy,
    IconGitBranch,
    IconHash
} from '@tabler/icons-react'
import { Badge, Box, Button, Code, Group, Modal, Stack, Text, Title, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'

import { getBuildInfo } from '@shared/utils/get-build-info/get-build-info.util'

interface BuildInfoModalProps {
    onClose: () => void
    opened: boolean
}

export function BuildInfoModal({ opened, onClose }: BuildInfoModalProps) {
    const buildInfo = getBuildInfo()
    const buildDate = new Date(buildInfo.buildTime).toLocaleString()
    const clipboard = useClipboard({ timeout: 1000 })

    const copyBuildInfo = () => {
        clipboard.copy(JSON.stringify(buildInfo, null, 2))
    }

    return (
        <Modal
            centered
            onClose={onClose}
            opened={opened}
            padding="xl"
            size="md"
            title={
                <Group justify="space-between" w="100%">
                    <Title order={3}>Build Info</Title>
                    <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy build info'}>
                        <Button
                            color={clipboard.copied ? 'green' : 'gray'}
                            leftSection={
                                clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                            }
                            onClick={copyBuildInfo}
                            size="compact-sm"
                            variant="subtle"
                        >
                            Copy
                        </Button>
                    </Tooltip>
                </Group>
            }
            withCloseButton
        >
            <Stack gap="md">
                <Group align="flex-start">
                    <IconCalendar size={20} />
                    <Box>
                        <Text fw={500}>Build Time</Text>
                        <Text c="dimmed" size="sm">
                            {buildDate}
                        </Text>
                    </Box>
                </Group>

                <Group align="flex-start">
                    <IconGitBranch size={20} />
                    <Box>
                        <Text fw={500}>Branch</Text>
                        <Badge color="blue" variant="light">
                            {buildInfo.branch}
                        </Badge>
                        {buildInfo.tag && (
                            <Badge color="green" ml="xs" variant="light">
                                {buildInfo.tag}
                            </Badge>
                        )}
                    </Box>
                </Group>

                <Group align="flex-start">
                    <IconHash size={20} />
                    <Box>
                        <Text fw={500}>Commit</Text>
                        <Code>{buildInfo.commit}</Code>
                    </Box>
                </Group>

                <Group gap="md" justify="center" mt="lg">
                    <Button
                        component="a"
                        href={buildInfo.commitUrl}
                        leftSection={<IconBrandGithub size={16} />}
                        size="sm"
                        target="_blank"
                        variant="outline"
                    >
                        View on GitHub
                    </Button>

                    <Button
                        c="cyan"
                        component="a"
                        href={'https://t.me/remnawave'}
                        leftSection={<IconBrandTelegram size={16} />}
                        size="sm"
                        target="_blank"
                        variant="outline"
                    >
                        Join Community
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
