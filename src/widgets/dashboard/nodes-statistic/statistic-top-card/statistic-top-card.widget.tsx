import { Box, Card, Center, Group, Skeleton, Stack, Text } from '@mantine/core'
import { GetNodesUsageByRangeCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'

import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { CountryFlag } from '@shared/ui/get-country-flag'

import styles from './statistic-top-card.module.css'

interface IProps {
    isLoading: boolean
    topNodes: (GetNodesUsageByRangeCommand.Response['response']['topNodes'][number] & {
        color: string
    })[]
}

export const NodesStatisticTopNodesCardWidget = (props: IProps) => {
    const { topNodes, isLoading } = props

    const { t } = useTranslation()

    let maxTraffic = 1
    if (topNodes.length > 0) {
        maxTraffic = topNodes[0].total
    }

    return (
        <Card p="md" withBorder>
            <Stack gap="sm">
                {isLoading && (
                    <Stack gap={6}>
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                        <Skeleton height={40} />
                    </Stack>
                )}
                {!isLoading && topNodes.length > 0 && (
                    <Stack gap={6}>
                        {topNodes.map((node) => {
                            return (
                                <Box
                                    bdrs="sm"
                                    bg="var(--mantine-color-default-hover)"
                                    key={node.uuid}
                                    p="xs"
                                    pos="relative"
                                >
                                    <Box
                                        bdrs="sm"
                                        className={styles.itemBackground}
                                        style={{
                                            width: `${(node.total / maxTraffic) * 100}%`,
                                            background: node.color
                                        }}
                                    />
                                    <Group
                                        gap={10}
                                        justify="space-between"
                                        style={{ position: 'relative' }}
                                        wrap="nowrap"
                                    >
                                        <Group gap={10} wrap="nowrap">
                                            <Box
                                                h={8}
                                                style={{
                                                    background: node.color,
                                                    borderRadius: '50%',
                                                    flexShrink: 0
                                                }}
                                                w={8}
                                            />
                                            <CountryFlag countryCode={node.countryCode} />
                                            <Text fw={600} size="sm" truncate>
                                                {node.name}
                                            </Text>
                                        </Group>
                                        <Text fw={600} size="sm" style={{ flexShrink: 0 }}>
                                            {prettyBytesToAnyUtil(node.total)}
                                        </Text>
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                )}
                {!isLoading && topNodes.length === 0 && (
                    <Center h={200}>
                        <Stack align="center" gap={8}>
                            <PiEmpty size="32px" style={{ opacity: 0.5 }} />
                            <Text c="dimmed" size="sm">
                                {t('statistic-nodes.component.no-data-available')}
                            </Text>
                        </Stack>
                    </Center>
                )}
            </Stack>
        </Card>
    )
}
