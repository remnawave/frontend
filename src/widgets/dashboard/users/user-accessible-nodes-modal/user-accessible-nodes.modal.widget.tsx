import {
    Badge,
    Box,
    Card,
    Center,
    Drawer,
    Group,
    Loader,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Tree,
    TreeNodeData
} from '@mantine/core'
import { IconChevronDown, IconFlag, IconServer } from '@tabler/icons-react'
import { GetUserAccessibleNodesCommand } from '@remnawave/backend-contract'
import { TbCirclesRelation, TbServer } from 'react-icons/tb'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { PiTag } from 'react-icons/pi'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { useGetUserAccessibleNodes } from '@shared/api/hooks'
import { XrayLogo } from '@shared/ui/logos'

interface CustomTreeNodeData extends TreeNodeData {
    configProfileName?: string
    countryCode?: string
    inbounds?: string[]
    nodeType?: 'inbound' | 'node' | 'squad'
}

interface RenderTreeNodeProps {
    elementProps: {
        className: string
        'data-hovered': boolean | undefined
        'data-selected': boolean | undefined
        'data-value': string
        onClick: (event: React.MouseEvent) => void
        style: React.CSSProperties
    }
    expanded: boolean
    hasChildren: boolean
    node: CustomTreeNodeData
}

export const UserAccessibleNodesModalWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState } = useModalsStore(
        (state) => state.modals[MODALS.USER_ACCESSIBLE_NODES_DRAWER]
    )
    const { close } = useModalsStore()

    const { data: userAccessibleNodes, isLoading } = useGetUserAccessibleNodes({
        route: {
            uuid: internalState?.userUuid ?? ''
        },
        rQueryParams: {
            enabled: !!internalState
        }
    })

    const returnLoading = () => {
        return (
            <Center h={200}>
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">
                        {t('user-accessible-nodes.modal.widget.loading-accessible-nodes')}
                    </Text>
                </Stack>
            </Center>
        )
    }

    const convertToTreeData = (
        nodes: GetUserAccessibleNodesCommand.Response['response']['activeNodes']
    ): CustomTreeNodeData[] => {
        return nodes.map((node) => ({
            value: node.uuid,
            label: node.nodeName,
            nodeType: 'node',
            countryCode: node.countryCode,
            configProfileName: node.configProfileName,
            children: node.activeSquads.map((squad) => ({
                value: `${node.uuid}-${squad.squadName}`,
                label: squad.squadName,
                nodeType: 'squad',
                inbounds: squad.activeInbounds,
                children: squad.activeInbounds.map((inbound, index) => ({
                    value: `${node.uuid}-${squad.squadName}-${inbound}-${index}`,
                    label: inbound,
                    nodeType: 'inbound'
                }))
            }))
        }))
    }

    const renderTreeNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodeProps) => {
        const getNodeContent = () => {
            switch (node.nodeType) {
                case 'inbound':
                    return null
                case 'node':
                    return (
                        <Card
                            m="xs"
                            p="md"
                            style={{
                                backgroundColor: 'var(--mantine-color-dark-6)',
                                borderWidth: '1px'
                            }}
                            withBorder
                        >
                            <Stack gap="sm">
                                <Group align="center" gap="md">
                                    {hasChildren && (
                                        <IconChevronDown
                                            color="var(--mantine-color-gray-4)"
                                            size={16}
                                            style={{
                                                transform: expanded
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)',
                                                transition: 'transform 150ms ease'
                                            }}
                                        />
                                    )}
                                    <TbServer color="var(--mantine-color-blue-4)" size={24} />
                                    {node.countryCode && node.countryCode !== 'XX' && (
                                        <ReactCountryFlag
                                            countryCode={node.countryCode}
                                            style={{ fontSize: '1.4em' }}
                                        />
                                    )}
                                    <Text c="gray.1" fw={600} size="lg">
                                        {node.label}
                                    </Text>
                                    <Badge
                                        color="teal"
                                        leftSection={<XrayLogo size={20} />}
                                        size="lg"
                                        variant="light"
                                    >
                                        {node.configProfileName}
                                    </Badge>

                                    {node.children?.length && (
                                        <Badge
                                            color="violet"
                                            leftSection={<TbCirclesRelation size={22} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {node.children.length}
                                        </Badge>
                                    )}
                                </Group>
                            </Stack>
                        </Card>
                    )
                case 'squad':
                    return (
                        <Box
                            m="xs"
                            p="md"
                            style={{
                                backgroundColor: 'var(--mantine-color-dark-8)',
                                borderRadius: '8px',
                                boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`
                            }}
                        >
                            <Stack gap="md">
                                <Group align="center" gap="md">
                                    {hasChildren && (
                                        <IconChevronDown
                                            color="var(--mantine-color-gray-5)"
                                            size={12}
                                            style={{
                                                transform: expanded
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)',
                                                transition: 'transform 150ms ease'
                                            }}
                                        />
                                    )}
                                    <TbCirclesRelation
                                        color="var(--mantine-color-violet-4)"
                                        size={22}
                                    />
                                    <Text c="gray.3" fw={500} size="lg">
                                        {node.label}
                                    </Text>
                                    {node.inbounds?.length && (
                                        <Badge
                                            color="var(--mantine-color-orange-4)"
                                            leftSection={<PiTag size={22} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {node.inbounds.length}
                                        </Badge>
                                    )}
                                </Group>

                                {expanded && node.inbounds && node.inbounds.length > 0 && (
                                    <SimpleGrid
                                        cols={{
                                            base: 1,
                                            sm: 2,
                                            md: 3,
                                            lg: 4
                                        }}
                                        spacing="xs"
                                    >
                                        {node.inbounds.map((inbound, index) => (
                                            <Box
                                                key={index}
                                                p="xs"
                                                style={{
                                                    backgroundColor: 'var(--mantine-color-dark-7)',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--mantine-color-gray-8)',
                                                    maxWidth: '200px',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Group align="center" gap="xs" wrap="nowrap">
                                                    <PiTag
                                                        color="var(--mantine-color-orange-4)"
                                                        size={16}
                                                        style={{ flexShrink: 0 }}
                                                    />
                                                    <Text
                                                        c="gray.4"
                                                        fw={600}
                                                        size="sm"
                                                        style={{ minWidth: 0 }}
                                                        truncate
                                                    >
                                                        {inbound}
                                                    </Text>
                                                </Group>
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                )}
                            </Stack>
                        </Box>
                    )
                default:
                    return null
            }
        }

        if (node.nodeType === 'inbound') {
            return null
        }

        return (
            <Box
                {...elementProps}
                style={{ ...elementProps.style, cursor: hasChildren ? 'pointer' : 'default' }}
            >
                {getNodeContent()}
            </Box>
        )
    }

    const renderAccessibleNodes = () => {
        if (!userAccessibleNodes?.activeNodes?.length) {
            return (
                <Center h={200}>
                    <Stack align="center" gap="md">
                        <IconServer color="var(--mantine-color-gray-5)" size={48} />
                        <Text c="dimmed" size="lg" ta="center">
                            {t(
                                'user-accessible-nodes.modal.widget.no-accessible-nodes-found-for-this-user'
                            )}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        const treeData = convertToTreeData(userAccessibleNodes.activeNodes)

        return (
            <Stack gap="lg">
                <Card p="md" withBorder>
                    <Group align="center" gap="md">
                        <IconFlag color="var(--mantine-color-blue-4)" size={20} />
                        <Text c="gray.1" fw={600} size="lg">
                            {t('user-accessible-nodes.modal.widget.access-summary')}
                        </Text>
                        <Badge
                            color="blue"
                            leftSection={<TbServer size={22} />}
                            size="lg"
                            variant="light"
                        >
                            {userAccessibleNodes.activeNodes.length}
                        </Badge>

                        <Badge
                            color="violet"
                            leftSection={<TbCirclesRelation size={22} />}
                            size="lg"
                            variant="light"
                        >
                            {userAccessibleNodes.activeNodes.reduce(
                                (acc, node) => acc + node.activeSquads.length,
                                0
                            )}
                        </Badge>

                        <Badge
                            color="var(--mantine-color-orange-4)"
                            leftSection={<PiTag size={22} />}
                            size="lg"
                            variant="light"
                        >
                            {userAccessibleNodes.activeNodes.reduce(
                                (acc, node) =>
                                    acc +
                                    node.activeSquads.reduce(
                                        (sum, squad) => sum + squad.activeInbounds.length,
                                        0
                                    ),
                                0
                            )}
                        </Badge>
                    </Group>
                </Card>

                <Box>
                    <Tree data={treeData} levelOffset={20} renderNode={renderTreeNode} />
                </Box>
            </Stack>
        )
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={() => close(MODALS.USER_ACCESSIBLE_NODES_DRAWER)}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="800px"
            title={
                <Group align="center" gap="sm">
                    <IconServer color="var(--mantine-color-blue-6)" size={24} />
                    <Title order={3}>
                        {t('user-accessible-nodes.modal.widget.user-accessible-nodes')}
                    </Title>
                </Group>
            }
        >
            {isLoading && returnLoading()}
            {!isLoading && userAccessibleNodes && renderAccessibleNodes()}
        </Drawer>
    )
}
