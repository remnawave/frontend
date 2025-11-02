import {
    ActionIcon,
    ActionIconGroup,
    Alert,
    Button,
    Group,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { TbAlertCircle, TbInfoCircle, TbPlus, TbRefresh, TbRocket, TbSearch } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { spotlight } from '@mantine/spotlight'
import { PiSpiral } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { useNodesStoreActions } from '@entities/dashboard/nodes/nodes-store/nodes-store'
import { useGetNodes, useRestartAllNodes } from '@shared/api/hooks'

export const NodesHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const actions = useNodesStoreActions()

    const handleCreate = () => {
        actions.toggleCreateModal(true)
    }

    const {
        isLoading: isGetNodesPending,
        refetch: refetchNodes,
        isPending,
        isRefetching
    } = useGetNodes()
    const { mutate: restartAllNodes, isPending: isRestartAllNodesPending } = useRestartAllNodes()

    const openRestartAllNodesModal = () => {
        modals.open({
            title: t('nodes-header-action-buttons.feature.restart-all-nodes'),
            centered: true,
            size: 'md',
            children: (
                <Stack>
                    <Alert color="blue" icon={<TbInfoCircle size={20} />} variant="light">
                        <Stack gap="xs">
                            <Text size="sm">
                                <Text component="span" fw={600}>
                                    {t('nodes-header-action-buttons.feature.force-restart')}
                                </Text>{' '}
                                {t('nodes-header-action-buttons.feature.force-restart-description')}
                            </Text>
                            <Text size="sm">
                                <Text component="span" fw={600}>
                                    {t('nodes-header-action-buttons.feature.graceful-restart')}
                                </Text>{' '}
                                {t(
                                    'nodes-header-action-buttons.feature.graceful-restart-description-1'
                                )}
                            </Text>
                        </Stack>
                    </Alert>

                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <Button
                            color="red"
                            leftSection={<TbAlertCircle size={22} />}
                            onClick={() => {
                                restartAllNodes({
                                    variables: {
                                        forceRestart: true
                                    }
                                })
                                modals.closeAll()
                            }}
                            size="md"
                        >
                            {t('nodes-header-action-buttons.feature.force')}
                        </Button>
                        <Button
                            leftSection={<TbRocket size={22} />}
                            onClick={() => {
                                restartAllNodes({
                                    variables: {
                                        forceRestart: false
                                    }
                                })
                                modals.closeAll()
                            }}
                            size="md"
                        >
                            {t('nodes-header-action-buttons.feature.graceful')}
                        </Button>
                    </Group>
                </Stack>
            )
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIconGroup>
                <Tooltip label={t('nodes-header-action-buttons.feature.search-nodes')}>
                    <ActionIcon
                        color="gray"
                        onClick={spotlight.open}
                        size="input-md"
                        variant="light"
                    >
                        <TbSearch size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip
                    label={t('nodes-header-action-buttons.feature.restart-all-nodes')}
                    withArrow
                >
                    <ActionIcon
                        color="grape"
                        loading={isRestartAllNodesPending}
                        onClick={() => {
                            openRestartAllNodesModal()
                        }}
                        size="input-md"
                        variant="light"
                    >
                        <PiSpiral size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('common.update')} withArrow>
                    <ActionIcon
                        loading={isGetNodesPending || isPending || isRefetching}
                        onClick={() => refetchNodes()}
                        size="input-md"
                        variant="light"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('nodes-header-action-buttons.feature.create-new-node')} withArrow>
                    <ActionIcon color="teal" onClick={handleCreate} size="input-md" variant="light">
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
