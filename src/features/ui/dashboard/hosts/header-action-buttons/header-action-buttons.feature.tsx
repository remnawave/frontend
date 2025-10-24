import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

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
            <ActionIconGroup>
                <Tooltip label={t('common.update')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="lg"
                        variant="light"
                    >
                        <TbRefresh size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('header-action-buttons.feature.create-new-host')} withArrow>
                    <ActionIcon color="teal" onClick={handleCreate} size="lg" variant="light">
                        <TbPlus size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
