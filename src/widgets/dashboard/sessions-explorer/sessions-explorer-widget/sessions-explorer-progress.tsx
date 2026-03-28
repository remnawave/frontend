import { Badge, Box, Group, Progress, Stack, Text } from '@mantine/core'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { FC, useState } from 'react'

import { LottieDuckProgressShared, LottieGlobeShared, LottieJailShared } from '@shared/ui/lotties'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { SectionCard } from '@shared/ui/section-card'

import type { ExplorerProgress } from './use-sessions-explorer'

import styles from './sessions-explorer.module.css'

const PROGRESS_LOTTIES: FC[] = [LottieDuckProgressShared, LottieGlobeShared, LottieJailShared]

const pickRandomLottie = () => PROGRESS_LOTTIES[Math.floor(Math.random() * PROGRESS_LOTTIES.length)]

interface IProps {
    progress: ExplorerProgress
}

export function SessionsExplorerProgress({ progress }: IProps) {
    const { t } = useTranslation()
    const [LottieComponent] = useState(pickRandomLottie)

    const progressPercent =
        progress.total > 0
            ? Math.round(((progress.completed + progress.failed) / progress.total) * 100)
            : 0

    return (
        <SectionCard.Root gap="md">
            <SectionCard.Section className={styles.progressCard}>
                <Stack align="center" gap="lg" py="xl" w="100%">
                    <div style={{ height: 120, display: 'flex', alignItems: 'center' }}>
                        {LottieComponent && <LottieComponent />}
                    </div>

                    <Stack align="center" gap="xs" w="100%">
                        <Text c="white" fw={600} size="lg">
                            {t('sessions-explorer-progress.exploring-nodes')}
                        </Text>
                        <Text c="dimmed" size="sm">
                            {t('sessions-explorer-progress.nodes-processed', {
                                completed: progress.completed + progress.failed,
                                total: progress.total
                            })}
                            {progress.failed > 0 && (
                                <Text c="red.5" component="span" fw={500}>
                                    {' '}
                                    (
                                    {t('sessions-explorer-progress.nodes-failed', {
                                        count: progress.failed
                                    })}
                                    )
                                </Text>
                            )}
                        </Text>
                    </Stack>

                    <Box px="xl" w="100%">
                        <Progress
                            animated
                            color="teal"
                            radius="xl"
                            size="lg"
                            striped
                            value={progressPercent}
                        />
                    </Box>

                    <Group gap="xs" justify="center" w="100%">
                        <AnimatePresence mode="popLayout">
                            {progress.activeNodes.map((node, i) => (
                                <motion.div
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    key={node.uuid}
                                    layout
                                    transition={{
                                        duration: 0.25,
                                        delay: i * 0.06
                                    }}
                                >
                                    <Badge
                                        color="teal"
                                        leftSection={<CountryFlag countryCode={node.countryCode} />}
                                        size="lg"
                                        variant="soft"
                                    >
                                        {node.name}
                                    </Badge>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Group>
                </Stack>
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
