import { PiArrowsClockwise } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'

import { useGetInbounds } from '@shared/api/hooks'

export const InboundsActionButtonsFeature = () => {
    const { t } = useTranslation()

    const { isFetching, refetch } = useGetInbounds()

    const handleUpdate = async () => {
        await refetch()
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isFetching}
                onClick={handleUpdate}
                size="xs"
                variant="default"
            >
                {t('header-action-buttons.feature.update')}
            </Button>
        </Group>
    )
}
