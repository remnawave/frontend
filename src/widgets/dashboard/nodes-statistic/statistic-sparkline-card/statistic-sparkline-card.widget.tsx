import { Box, Card, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Sparkline } from '@mantine/charts'

import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

interface IProps {
    isLoading: boolean
    sparklineData: number[] | undefined
}

export const NodesStatisticSparklineCardWidget = (props: IProps) => {
    const { sparklineData = [], isLoading } = props

    const { t } = useTranslation()

    const totalUsage = sparklineData.reduce((sum, val) => sum + val, 0)

    let dailyAverage = 0
    let peakDay = 0
    let isDataAvailable = false

    if (sparklineData.length > 0) {
        peakDay = Math.max(...sparklineData)
        dailyAverage = totalUsage / sparklineData.length
        isDataAvailable = true
    }

    return (
        <Card p="md" withBorder>
            <Stack gap="md">
                <Box>
                    <Text c="dimmed" fw={500} mb={4} size="xs" tt="uppercase">
                        {t('statistic-nodes.component.total-traffic')}
                    </Text>
                    {isLoading ? (
                        <Skeleton height={28} width={140} />
                    ) : (
                        <Text fw={700} style={{ fontSize: '2rem', lineHeight: 1 }}>
                            {prettyBytesToAnyUtil(totalUsage) || '0 GiB'}
                        </Text>
                    )}
                </Box>

                <SimpleGrid cols={2} spacing="sm">
                    <Box>
                        <Text c="dimmed" size="xs">
                            Ø / day
                        </Text>
                        {isLoading ? (
                            <Skeleton height={20} mt={4} width={80} />
                        ) : (
                            <Text fw={600} size="sm">
                                {prettyBytesToAnyUtil(dailyAverage) || '0 GiB'}
                            </Text>
                        )}
                    </Box>
                    <Box>
                        <Text c="dimmed" size="xs">
                            {t('statistic-sparkline-card.widget.peak')}
                        </Text>
                        {isLoading ? (
                            <Skeleton height={20} mt={4} width={80} />
                        ) : (
                            <Text fw={600} size="sm">
                                {prettyBytesToAnyUtil(peakDay) || '0 GiB'}
                            </Text>
                        )}
                    </Box>
                </SimpleGrid>

                <Box style={{ flex: 1 }}>
                    {isLoading ? (
                        <Skeleton height={100} />
                    ) : (
                        <Sparkline
                            curveType="bump"
                            data={isDataAvailable ? sparklineData : [1, 1, 1]}
                            fillOpacity={0.3}
                            h={100}
                            strokeWidth={2}
                            trendColors={{
                                negative: 'red.6',
                                neutral: 'gray.5',
                                positive: 'teal.6'
                            }}
                            w="100%"
                        />
                    )}
                </Box>
            </Stack>
        </Card>
    )
}
