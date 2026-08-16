import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbBook, TbList, TbPlus, TbRefresh, TbTerminal } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetNodePlugins } from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'

export const NodePluginsHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const { isFetching } = useGetNodePlugins()
    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIcon
                color="lime"
                component="a"
                href="https://docs.rw/docs/learn/node-plugins"
                size="input-md"
                target="_blank"
                variant="soft"
            >
                <TbBook size={24} />
            </ActionIcon>

            <UniversalSpotlightActionIconShared />

            <ActionIconGroup>
                <Tooltip label={t('common.shared-lists')} withArrow>
                    <ActionIcon
                        color="indigo"
                        onClick={() => showModal('sharedLists_sharedListsModal')}
                        size="input-md"
                        variant="soft"
                    >
                        <TbList size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label="Executor" withArrow>
                    <ActionIcon
                        color="grape"
                        onClick={() => showModal('nodePlugins_nodePluginExecutorDrawer')}
                        size="input-md"
                        variant="soft"
                    >
                        <TbTerminal size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('common.refresh')} withArrow>
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
                            createFrom: 'nodePlugin',
                            contentOptions: {
                                navigate
                            }
                        })
                    }
                    size="input-md"
                    variant="soft"
                >
                    <TbPlus size="24px" />
                </ActionIcon>
            </ActionIconGroup>
        </Group>
    )
}
