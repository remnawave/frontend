import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'

import { useHostsStoreActions } from '@entities/dashboard'
import { QueryKeys, useGetHosts } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

export const HeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const actions = useHostsStoreActions()

    const { isFetching } = useGetHosts()

    const handleCreate = () => {
        actions.toggleCreateModal(true)
    }

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.hosts._def
        })
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

            <Button
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
                size="xs"
                variant="default"
            >
                {t('header-action-buttons.feature.create-new-host')}
            </Button>
        </Group>
    )
}
