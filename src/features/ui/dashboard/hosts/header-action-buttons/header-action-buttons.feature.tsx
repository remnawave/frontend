import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { HelpActionIconShared } from '@shared/ui/help-drawer/help-action-icon.shared'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'
import { QueryKeys, useGetHosts } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

export const HeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    const { isFetching } = useGetHosts()

    const handleCreate = () => {
        openModalWithData(MODALS.CREATE_HOST_MODAL, undefined)
    }

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.hosts._def
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <HelpActionIconShared hidden={false} screen="PAGE_HOSTS" />

            <UniversalSpotlightActionIconShared />

            <ActionIconGroup>
                <Tooltip label={t('common.update')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="input-md"
                        variant="light"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('header-action-buttons.feature.create-new-host')} withArrow>
                    <ActionIcon color="teal" onClick={handleCreate} size="input-md" variant="light">
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
