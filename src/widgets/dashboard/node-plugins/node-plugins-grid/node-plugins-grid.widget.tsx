import { TbAlertTriangle, TbFlame, TbPlug, TbPlugConnectedX, TbShieldX } from 'react-icons/tb'
import { GetAllNodesCommand, GetNodePluginsCommand } from '@remnawave/backend-contract'
import { Badge, Center, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useCloneNodePlugin,
    useDeleteNodePlugin,
    useReorderNodePlugins
} from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'
import { SectionCard } from '@shared/ui/section-card'

import { ActivePluginsOnNodesModalShared } from '../active-on-nodes-modal/adtive-on-nodes.modal.shared'
import { NodePluginCardWidget } from '../node-plugin-card/node-plugin-card.widget'

interface IProps {
    nodes: GetAllNodesCommand.Response['response']
    plugins: GetNodePluginsCommand.Response['response']['nodePlugins']
}

export function NodePluginsGridWidget(props: IProps) {
    const { t } = useTranslation()
    const { nodes, plugins } = props

    const { mutate: deleteNodePlugin } = useDeleteNodePlugin({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
                })
                queryClient.refetchQueries({
                    queryKey: QueryKeys.nodes.getAllNodes.queryKey
                })
            }
        }
    })
    const { mutate: reorderNodePlugins } = useReorderNodePlugins({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.nodePlugins.getNodePlugins.queryKey, data)
            }
        }
    })

    const { mutate: cloneNodePlugin } = useCloneNodePlugin({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
                })
            }
        }
    })

    const handleDeleteNodePlugin = (nodePluginUuid: string) => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteNodePlugin({
                    route: {
                        uuid: nodePluginUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof plugins) => {
        reorderNodePlugins({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    const handleCloneNodePlugin = (nodePluginUuid: string) => {
        cloneNodePlugin({
            variables: {
                cloneFromUuid: nodePluginUuid
            }
        })
    }

    const handleShowActiveNodes = (nodePluginUuid: string) => {
        const activeOnNodes = nodes.filter((node) => node.activePluginUuid === nodePluginUuid)

        modals.open({
            children: <ActivePluginsOnNodesModalShared nodes={activeOnNodes} />,
            title: (
                <BaseOverlayHeader
                    IconComponent={TbPlug}
                    iconVariant="gradient-teal"
                    title={t('node-plugin-card.widget.active-on-nodes')}
                    titleOrder={5}
                />
            ),
            size: 'lg',
            centered: true
        })
    }

    if (!plugins || plugins.length === 0) {
        return (
            <SectionCard.Root p="xl">
                <SectionCard.Section>
                    <BaseOverlayHeader
                        IconComponent={TbAlertTriangle}
                        iconVariant="gradient-orange"
                        subtitle={t(
                            'node-plugins-grid.widget.node-plugins-are-an-advanced-feature-please-review-the-documentation-before-use'
                        )}
                        title={t('node-plugins-grid.widget.warning')}
                        titleOrder={4}
                    />
                </SectionCard.Section>

                <SectionCard.Section>
                    <Center py="xl">
                        <Stack align="center" gap="lg">
                            <ThemeIcon radius="xl" size={64} variant="gradient-gray">
                                <TbPlug size={32} />
                            </ThemeIcon>

                            <Stack align="center" gap="xs">
                                <Text fw={600} size="lg" ta="center">
                                    {t('node-plugins-grid.widget.no-node-plugins-yet')}
                                </Text>
                                <Text c="dimmed" maw={400} size="sm" ta="center">
                                    {t(
                                        'node-plugins-grid.widget.create-a-plugin-to-extend-node-capabilities-with'
                                    )}
                                </Text>
                            </Stack>

                            <Group gap="sm" justify="center">
                                <Badge
                                    leftSection={<TbFlame size={12} />}
                                    radius="md"
                                    size="lg"
                                    variant="light"
                                >
                                    Torrent Blocker
                                </Badge>
                                <Badge
                                    color="red"
                                    leftSection={<TbShieldX size={12} />}
                                    radius="md"
                                    size="lg"
                                    variant="light"
                                >
                                    Blacklist
                                </Badge>
                                <Badge
                                    color="violet"
                                    leftSection={<TbPlugConnectedX size={12} />}
                                    radius="md"
                                    size="lg"
                                    variant="light"
                                >
                                    Connection Drop
                                </Badge>
                            </Group>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    return (
        <VirtualizedDndGrid
            enableDnd={true}
            items={plugins}
            key={`node-plugins-grid-widget`}
            onReorder={handleReorder}
            renderDragOverlay={(nodePlugin) => (
                <NodePluginCardWidget
                    handleCloneNodePlugin={handleCloneNodePlugin}
                    handleDeleteNodePlugin={handleDeleteNodePlugin}
                    handleShowActiveNodes={handleShowActiveNodes}
                    isDragOverlay
                    nodePlugin={nodePlugin}
                />
            )}
            renderItem={(nodePlugin) => (
                <NodePluginCardWidget
                    handleCloneNodePlugin={handleCloneNodePlugin}
                    handleDeleteNodePlugin={handleDeleteNodePlugin}
                    handleShowActiveNodes={handleShowActiveNodes}
                    nodePlugin={nodePlugin}
                />
            )}
            useWindowScroll={true}
        />
    )
}
