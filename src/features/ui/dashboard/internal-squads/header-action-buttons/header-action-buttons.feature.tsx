import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPlus, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { HelpActionIconShared } from '@shared/_modals/universal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetInternalSquads } from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'

interface IProps {
    internalSquadCount: number
}

export const InternalSquadsHeaderActionButtonsFeature = (props: IProps) => {
    const { internalSquadCount } = props

    const { t } = useTranslation()
    const { isFetching } = useGetInternalSquads()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <HelpActionIconShared hidden={false} screen="PAGE_INTERNAL_SQUADS" />

            {internalSquadCount > 0 && <UniversalSpotlightActionIconShared />}

            <ActionIconGroup>
                <Tooltip label={t('common.action.update')} withArrow>
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
                <Tooltip
                    label={t('common.action.create')}
                    withArrow
                >
                    <ActionIcon
                        color="teal"
                        onClick={() =>
                            showModal('createModal', {
                                createFrom: 'internalSquad',
                                contentOptions: {}
                            })
                        }
                        size="input-md"
                        variant="soft"
                    >
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
