import { Button, Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbRefresh } from 'react-icons/tb'

import { SectionCard } from '@shared/ui/section-card'

import { SummaryCardWidget } from './summary-card.widget'

interface IProps {
    onDropAll: () => void
    onRefresh: () => void
}

export const FailedStateWidget = ({ onDropAll, onRefresh }: IProps) => {
    const { t } = useTranslation()

    return (
        <Stack gap="md">
            <SummaryCardWidget
                distinctIps={0}
                onDropAll={onDropAll}
                onRefresh={onRefresh}
                totalIps={0}
            />

            <SectionCard.Root gap="sm">
                <SectionCard.Section>
                    <Center h="230">
                        <Stack align="center" gap="xs">
                            <ThemeIcon color="red" radius="md" size="xl" variant="soft">
                                <TbAlertTriangle size={24} />
                            </ThemeIcon>
                            <Text c="dimmed" size="md">
                                {t('active-sessions-drawer.widget.job-failed-description')}
                            </Text>

                            <Button
                                color="teal"
                                leftSection={<TbRefresh size={20} />}
                                onClick={onRefresh}
                                size="md"
                                variant="soft"
                            >
                                {t('common.action.try-again')}
                            </Button>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        </Stack>
    )
}
