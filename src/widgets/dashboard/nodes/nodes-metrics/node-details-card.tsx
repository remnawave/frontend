import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Center,
    Grid,
    Group,
    px,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import {
    PiArrowDownDuotone,
    PiArrowUpDuotone,
    PiEyeDuotone,
    PiEyeSlashDuotone,
    PiProhibitDuotone,
    PiTag,
    PiUsersDuotone
} from 'react-icons/pi'
import { GetNodesMetricsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbServer2 } from 'react-icons/tb'
import { memo, useState } from 'react'

import { SectionCard } from '@shared/ui/section-card'
import { formatInt } from '@shared/utils/misc'

export const NodeDetailsCard = memo(
    ({
        node,
        handleNodeClick
    }: {
        handleNodeClick: (nodeUuid: string) => void
        node: GetNodesMetricsCommand.Response['response']['nodes'][number]
    }) => {
        const [hideZeroValues, setHideZeroValues] = useState(true)
        const { t } = useTranslation()

        const filterNonZeroStats = (stats: typeof node.inboundsStats) => {
            if (!hideZeroValues) return stats
            return stats.filter((stat) => stat.upload !== '0' || stat.download !== '0')
        }

        const filteredInboundStats = filterNonZeroStats(node.inboundsStats)
        const filteredOutboundStats = filterNonZeroStats(node.outboundsStats)

        return (
            <SectionCard.Root>
                <SectionCard.Section>
                    <Group align="center" justify="space-between" style={{ minWidth: 0 }}>
                        <Group
                            gap="md"
                            grow={false}
                            preventGrowOverflow={true}
                            style={{ minWidth: 0, flex: 1 }}
                            wrap="nowrap"
                        >
                            <ThemeIcon
                                onClick={() => {
                                    handleNodeClick(node.nodeUuid)
                                }}
                                size="xl"
                                style={{
                                    cursor: 'pointer'
                                }}
                                variant="gradient-indigo"
                            >
                                <TbServer2
                                    size="24px"
                                    style={{
                                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                                    }}
                                />
                            </ThemeIcon>
                            <Box style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                                <Group
                                    align="center"
                                    gap="xs"
                                    style={{ minWidth: 0 }}
                                    wrap="nowrap"
                                >
                                    <Text size="lg" style={{ flexShrink: 0 }}>
                                        {node.countryEmoji}
                                    </Text>

                                    <Text
                                        c="white"
                                        fw={600}
                                        size="md"
                                        style={{
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {node.nodeName}
                                    </Text>
                                </Group>
                                {node.providerName !== 'unknown' ? (
                                    <Text
                                        c="gray.4"
                                        size="sm"
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {node.providerName}
                                    </Text>
                                ) : (
                                    <Text c="gray.4" size="sm">
                                        ㅤ
                                    </Text>
                                )}
                            </Box>
                        </Group>

                        <Group gap="xs" style={{ flexShrink: 0, minWidth: 'fit-content' }}>
                            <Tooltip
                                label={
                                    hideZeroValues
                                        ? t('node-details-card.show-zero-values')
                                        : t('node-details-card.hide-zero-values')
                                }
                            >
                                <ActionIcon
                                    color="indigo"
                                    onClick={() => setHideZeroValues(!hideZeroValues)}
                                    size="md"
                                    variant="light"
                                >
                                    {hideZeroValues ? (
                                        <PiEyeSlashDuotone size="1rem" />
                                    ) : (
                                        <PiEyeDuotone size="1rem" />
                                    )}
                                </ActionIcon>
                            </Tooltip>

                            <Badge
                                color="teal"
                                leftSection={<PiUsersDuotone size={px('0.9rem')} />}
                                size="lg"
                                style={{ flexShrink: 0 }}
                                variant="light"
                            >
                                {formatInt(node.usersOnline)}
                            </Badge>
                        </Group>
                    </Group>
                </SectionCard.Section>
                <SectionCard.Section>
                    <Grid align="flex-start" justify="flex-start">
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Card
                                p="md"
                                style={{
                                    background: 'rgba(16, 185, 129, 0.05)',
                                    border: '1px solid rgba(16, 185, 129, 0.15)'
                                }}
                            >
                                <Group align="center" gap="xs" mb="xs" wrap="nowrap">
                                    <PiArrowDownDuotone
                                        color="var(--mantine-color-teal-4)"
                                        size="16px"
                                    />
                                    <Text
                                        c="teal.4"
                                        fw={500}
                                        size="sm"
                                        style={{
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Inbound Traffic
                                    </Text>
                                </Group>

                                {filteredInboundStats.length > 0 ? (
                                    filteredInboundStats.map((stat) => (
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
                                                <Group align="flex-start" gap="xs" wrap="nowrap">
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
                                                            {stat.upload === '0'
                                                                ? '0 B'
                                                                : stat.upload}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                                <Group align="flex-start" gap="xs" wrap="nowrap">
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
                                                {t('node-details-card.no-inbound-traffic-data')}
                                            </Text>
                                        </Stack>
                                    </Center>
                                )}
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Card
                                p="md"
                                style={{
                                    background: 'rgba(59, 130, 246, 0.05)',
                                    border: '1px solid rgba(59, 130, 246, 0.15)'
                                }}
                            >
                                <Group align="center" gap="xs" mb="xs" wrap="nowrap">
                                    <PiArrowUpDuotone
                                        color="var(--mantine-color-blue-4)"
                                        size="16px"
                                    />
                                    <Text
                                        c="blue.4"
                                        fw={500}
                                        size="sm"
                                        style={{
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Outbound Traffic
                                    </Text>
                                </Group>
                                {filteredOutboundStats.length > 0 ? (
                                    filteredOutboundStats.map((stat) => (
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
                                                <Group align="flex-start" gap="xs" wrap="nowrap">
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
                                                            {stat.upload === '0'
                                                                ? '0 B'
                                                                : stat.upload}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                                <Group align="flex-start" gap="xs" wrap="nowrap">
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
                                                {t('node-details-card.no-outbound-traffic-data')}
                                            </Text>
                                        </Stack>
                                    </Center>
                                )}
                            </Card>
                        </Grid.Col>
                    </Grid>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }
)
