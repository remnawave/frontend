import {
    Badge,
    Box,
    Card,
    Center,
    Divider,
    Group,
    Paper,
    px,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon
} from '@mantine/core'
import {
    PiArrowDownDuotone,
    PiArrowUpDuotone,
    PiProhibitDuotone,
    PiTag,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetNodesMetricsCommand } from '@remnawave/backend-contract'
import { TbServer2 } from 'react-icons/tb'
import { memo } from 'react'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { formatInt } from '@shared/utils/misc'

import styles from './NodesMetrics.module.css'

export const NodeDetailsCard = memo(
    ({ node }: { node: GetNodesMetricsCommand.Response['response']['nodes'][number] }) => {
        const { open, setInternalData } = useModalsStore()
        return (
            <Paper className={styles.NodeDetailCardPaper} p="lg" radius="lg">
                <Box className={styles.NodeDetailCardBox} />

                <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
                    <Group align="center" justify="space-between">
                        <Group gap="md">
                            <ThemeIcon
                                color="indigo"
                                onClick={() => {
                                    setInternalData({
                                        internalState: { nodeUuid: node.nodeUuid },
                                        modalKey: MODALS.EDIT_NODE_BY_UUID_MODAL
                                    })
                                    open(MODALS.EDIT_NODE_BY_UUID_MODAL)
                                }}
                                size="xl"
                                style={{
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                                    transform: 'translateY(-1px)' // Subtle lift effect
                                }}
                                variant="light"
                            >
                                <TbServer2
                                    size="24px"
                                    style={{
                                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                                    }}
                                />
                            </ThemeIcon>
                            <Box>
                                <Group align="center" gap="xs">
                                    <Text size="lg">{node.countryEmoji}</Text>

                                    <Text c="white" fw={600} size="lg">
                                        {node.nodeName}
                                    </Text>
                                </Group>
                                <Text c="gray.4" size="sm">
                                    {node.providerName}
                                </Text>
                            </Box>
                        </Group>

                        <Badge
                            color="teal"
                            leftSection={<PiUsersDuotone size={px('0.9rem')} />}
                            size="lg"
                            variant="light"
                        >
                            {formatInt(node.usersOnline)}
                        </Badge>
                    </Group>

                    <Divider color="gray.8" />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <Card
                            p="md"
                            radius="md"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                        >
                            <Group align="center" gap="xs" mb="xs">
                                <PiArrowDownDuotone
                                    color="var(--mantine-color-teal-4)"
                                    size="16px"
                                />
                                <Text c="teal.4" fw={500} size="sm">
                                    Inbound Traffic
                                </Text>
                            </Group>

                            {node.inboundsStats.length > 0 ? (
                                node.inboundsStats.map((stat) => (
                                    <Box key={stat.tag} mb="sm">
                                        <Group align="center" justify="space-between" mb="xs">
                                            <Badge
                                                color="teal"
                                                leftSection={<PiTag size={px('0.8rem')} />}
                                                size="sm"
                                                variant="outline"
                                            >
                                                {stat.tag}
                                            </Badge>
                                        </Group>
                                        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs">
                                            <Group align="flex-start" gap="xs">
                                                <PiArrowUpDuotone
                                                    color="var(--mantine-color-orange-4)"
                                                    size="0.75rem"
                                                    style={{ marginTop: '2px' }}
                                                />
                                                <Stack gap={1}>
                                                    <Text
                                                        c="orange.4"
                                                        fw={500}
                                                        lh={1}
                                                        size="9px"
                                                        tt="uppercase"
                                                    >
                                                        Up
                                                    </Text>
                                                    <Text c="gray.3" ff="monospace" size="xs">
                                                        {stat.upload === '0' ? '0 B' : stat.upload}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                            <Group align="flex-start" gap="xs">
                                                <PiArrowDownDuotone
                                                    color="var(--mantine-color-green-4)"
                                                    size="0.75rem"
                                                    style={{ marginTop: '2px' }}
                                                />
                                                <Stack gap={1}>
                                                    <Text
                                                        c="green.4"
                                                        fw={500}
                                                        lh={1}
                                                        size="9px"
                                                        tt="uppercase"
                                                    >
                                                        Down
                                                    </Text>
                                                    <Text c="gray.3" ff="monospace" size="xs">
                                                        {stat.download === '0'
                                                            ? '0 B'
                                                            : stat.download}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </SimpleGrid>
                                    </Box>
                                ))
                            ) : (
                                <Center h="100%">
                                    <Stack align="center" gap="xs">
                                        <ThemeIcon color="gray" size="sm" variant="light">
                                            <PiProhibitDuotone size="1.0rem" />
                                        </ThemeIcon>
                                        <Text c="gray.5" size="xs" ta="center">
                                            No inbound traffic data
                                        </Text>
                                    </Stack>
                                </Center>
                            )}
                        </Card>

                        <Card
                            p="md"
                            radius="md"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        >
                            <Group align="center" gap="xs" mb="xs">
                                <PiArrowUpDuotone color="var(--mantine-color-blue-4)" size="16px" />
                                <Text c="blue.4" fw={500} size="sm">
                                    Outbound Traffic
                                </Text>
                            </Group>
                            {node.outboundsStats.length > 0 ? (
                                node.outboundsStats.map((stat) => (
                                    <Box key={stat.tag} mb="sm">
                                        <Group align="center" justify="space-between" mb="xs">
                                            <Badge
                                                color="blue"
                                                leftSection={<PiTag size={px('0.8rem')} />}
                                                size="sm"
                                                variant="outline"
                                            >
                                                {stat.tag}
                                            </Badge>
                                        </Group>
                                        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs">
                                            <Group align="flex-start" gap="xs">
                                                <PiArrowUpDuotone
                                                    color="var(--mantine-color-orange-4)"
                                                    size="0.75rem"
                                                    style={{ marginTop: '2px' }}
                                                />
                                                <Stack gap={1}>
                                                    <Text
                                                        c="orange.4"
                                                        fw={500}
                                                        lh={1}
                                                        size="9px"
                                                        tt="uppercase"
                                                    >
                                                        Up
                                                    </Text>
                                                    <Text c="gray.3" ff="monospace" size="xs">
                                                        {stat.upload === '0' ? '0 B' : stat.upload}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                            <Group align="flex-start" gap="xs">
                                                <PiArrowDownDuotone
                                                    color="var(--mantine-color-green-4)"
                                                    size="0.75rem"
                                                    style={{ marginTop: '2px' }}
                                                />
                                                <Stack gap={1}>
                                                    <Text
                                                        c="green.4"
                                                        fw={500}
                                                        lh={1}
                                                        size="9px"
                                                        tt="uppercase"
                                                    >
                                                        Down
                                                    </Text>
                                                    <Text c="gray.3" ff="monospace" size="xs">
                                                        {stat.download === '0'
                                                            ? '0 B'
                                                            : stat.download}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </SimpleGrid>
                                    </Box>
                                ))
                            ) : (
                                <Center h="100%">
                                    <Stack align="center" gap="xs">
                                        <ThemeIcon color="gray" size="sm" variant="light">
                                            <PiProhibitDuotone size="1.0rem" />
                                        </ThemeIcon>
                                        <Text c="gray.5" size="xs" ta="center">
                                            No outbound traffic data
                                        </Text>
                                    </Stack>
                                </Center>
                            )}
                        </Card>
                    </SimpleGrid>
                </Stack>
            </Paper>
        )
    }
)
