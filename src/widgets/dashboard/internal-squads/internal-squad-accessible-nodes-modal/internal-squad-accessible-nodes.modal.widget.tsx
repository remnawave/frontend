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
import { GetInternalSquadAccessibleNodesCommand } from '@remnawave/backend-contract'
import { IconChevronDown, IconFlag, IconServer } from '@tabler/icons-react'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'
import { PiTag } from 'react-icons/pi'
import ColorHash from 'color-hash'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { useGetInternalSquadAccessibleNodes } from '@shared/api/hooks'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

interface CustomTreeNodeData extends TreeNodeData {
    configProfileColor?: string
    configProfileName?: string
    countryCode?: string
    inbounds?: string[]
    nodeType?: 'inbound' | 'node'
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

const ch = new ColorHash({
    hue: [
        { min: 120, max: 125 }, // green (#7EB26D)
        { min: 45, max: 50 }, // yellow (#EAB839)
        { min: 185, max: 190 }, // light blue (#6ED0E0)
        { min: 25, max: 30 }, // orange (#EF843C)
        { min: 0, max: 5 }, // red (#E24D42)
        { min: 210, max: 215 }, // blue (#1F78C1)
        { min: 300, max: 305 }, // purple (#BA43A9)
        { min: 270, max: 275 }, // violet (#705DA0)
        { min: 100, max: 105 }, // dark green (#508642)
        { min: 45, max: 50 }, // dark yellow (#CCA300)
        { min: 210, max: 215 }, // dark blue (#447EBC)
        { min: 25, max: 30 }, // dark orange (#C15C17)
        { min: 0, max: 5 }, // dark red (#890F02)
        { min: 150, max: 155 }, // teal (#2B908F)
        { min: 330, max: 335 }, // pink (#EA6460)
        { min: 240, max: 245 }, // indigo (#5195CE)
        { min: 60, max: 65 }, // lime (#B3DE69)
        { min: 15, max: 20 }, // coral (#FFA07A)
        { min: 285, max: 290 }, // magenta (#C71585)
        { min: 165, max: 170 } // turquoise (#40E0D0)
    ],
    lightness: [0.3, 0.4, 0.5, 0.6, 0.7],
    saturation: [0.4, 0.5, 0.6, 0.7, 0.8]
})

export const InternalSquadAccessibleNodesModalWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState } = useModalsStore(
        (state) => state.modals[MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER]
    )
    const { close } = useModalsStore()

    const { data: internalSquadAccessibleNodes, isLoading } = useGetInternalSquadAccessibleNodes({
        route: {
            uuid: internalState?.squadUuid ?? ''
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
        nodes: GetInternalSquadAccessibleNodesCommand.Response['response']['accessibleNodes']
    ): CustomTreeNodeData[] => {
        return nodes.map((node) => ({
            value: node.uuid,
            label: node.nodeName,
            nodeType: 'node',
            countryCode: node.countryCode,
            configProfileName: node.configProfileName,
            configProfileColor: ch.hex(node.configProfileUuid ?? ''),
            inbounds: node.activeInbounds,
            children: node.activeInbounds.map((inbound, index) => ({
                value: `${node.uuid}-${inbound}-${index}`,
                label: inbound,
                nodeType: 'inbound'
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
                        <Card bg="dark.6" m="xs" p="md" withBorder>
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
                                    {node.countryCode && node.countryCode !== 'XX' ? (
                                        <ReactCountryFlag
                                            countryCode={node.countryCode}
                                            style={{ fontSize: '1.2em' }}
                                        />
                                    ) : (
                                        <TbServer color="var(--mantine-color-blue-4)" size={20} />
                                    )}
                                    <Text c="gray.1" fw={600} size="md">
                                        {node.label}
                                    </Text>
                                    <Badge
                                        autoContrast
                                        color={node.configProfileColor}
                                        leftSection={<XtlsLogo size={20} />}
                                        size="md"
                                        variant="light"
                                    >
                                        {node.configProfileName}
                                    </Badge>

                                    {node.inbounds?.length && (
                                        <Badge
                                            color="orange"
                                            leftSection={<PiTag size={22} />}
                                            size="md"
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
                                            md: 3
                                        }}
                                        mt="md"
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
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <Group align="center" gap="xs" wrap="nowrap">
                                                    <PiTag
                                                        color="var(--mantine-color-orange-4)"
                                                        size={14}
                                                        style={{ flexShrink: 0 }}
                                                    />
                                                    <Text
                                                        c="gray.4"
                                                        fw={600}
                                                        size="xs"
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
                        </Card>
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
        if (!internalSquadAccessibleNodes?.accessibleNodes?.length) {
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

        const treeData = convertToTreeData(internalSquadAccessibleNodes.accessibleNodes)

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
                            {internalSquadAccessibleNodes.accessibleNodes.length}
                        </Badge>

                        <Badge
                            color="orange"
                            leftSection={<PiTag size={22} />}
                            size="lg"
                            variant="light"
                        >
                            {internalSquadAccessibleNodes.accessibleNodes.reduce(
                                (acc, node) => acc + node.activeInbounds.length,
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
            onClose={() => close(MODALS.INTERNAL_SQUAD_ACCESSIBLE_NODES_DRAWER)}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="800px"
            title={
                <Group align="center" gap="sm">
                    <IconServer color="var(--mantine-color-blue-6)" size={24} />
                    <Title order={3}>
                        {t(
                            'internal-squad-accessible-nodes.modal.widget.internal-squad-accessible-nodes'
                        )}
                    </Title>
                </Group>
            }
        >
            {isLoading && returnLoading()}
            {!isLoading && internalSquadAccessibleNodes && renderAccessibleNodes()}
        </Drawer>
    )
}
