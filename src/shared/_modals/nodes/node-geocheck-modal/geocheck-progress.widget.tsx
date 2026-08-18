import { Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { LottieGlobeShared } from '@shared/ui/lotties/globe'

export const GeocheckProgressWidget = () => {
    const { t } = useTranslation()

    return (
        <Stack align="center" gap="md" py="lg">
            <div style={{ height: 120, display: 'flex', alignItems: 'center' }}>
                <LottieGlobeShared />
            </div>

            <Text c="white" fw={600} size="md">
                {t('node-geocheck.running')}
            </Text>

            <Text c="dimmed" size="sm" ta="center">
                {t('node-geocheck.running-description')}
            </Text>
        </Stack>
    )
}
