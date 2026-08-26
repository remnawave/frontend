import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetSubpageConfigs } from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'

export const SubpageConfigsHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const { isFetching } = useGetSubpageConfigs()

    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.subpageConfigs.getSubpageConfigs.queryKey
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <UniversalSpotlightActionIconShared />

            <ActionIconGroup>
                <Tooltip label={t('common.action.refresh')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="input-md"
                        variant="soft"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <ActionIcon
                    color="teal"
                    onClick={() =>
                        showModal('createModal', {
                            createFrom: 'subpageConfig',
                            contentOptions: { navigate }
                        })
                    }
                    size="input-md"
                    variant="light"
                >
                    <TbPlus size="24px" />
                </ActionIcon>
            </ActionIconGroup>
        </Group>
    )
}
