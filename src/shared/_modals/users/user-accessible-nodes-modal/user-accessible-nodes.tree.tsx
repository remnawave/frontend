import { Badge, Group, RenderTreeNodePayload, Text, Tree, TreeNodeData } from '@mantine/core'
import { GetUserAccessibleNodesCommand } from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { PiTag } from 'react-icons/pi'
import { TbChevronRight, TbCirclesRelation } from 'react-icons/tb'

import { CountryFlag } from '@shared/ui/get-country-flag'
import { XrayLogo } from '@shared/ui/logos'
import { SectionCard } from '@shared/ui/section-card'

type ActiveNode = GetUserAccessibleNodesCommand.Response['response']['activeNodes'][number]

type UserAccessibleTreeMeta =
    | { configProfileName: string; count: number; countryCode: string; kind: 'node' }
    | { count: number; kind: 'squad' }
    | { kind: 'inbound' }

interface UserAccessibleTreeNode extends TreeNodeData {
    children?: UserAccessibleTreeNode[]
    nodeProps: UserAccessibleTreeMeta
}

const renderTreeNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) => {
    const meta = node.nodeProps as UserAccessibleTreeMeta | undefined

    return (
        <Group gap={8} py={4} wrap="nowrap" {...elementProps}>
            {hasChildren ? (
                <TbChevronRight
                    size={16}
                    style={{
                        flexShrink: 0,
                        opacity: 0.6,
                        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 150ms ease'
                    }}
                />
            ) : (
                <PiTag size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
            )}

            {meta?.kind === 'node' && <CountryFlag countryCode={meta.countryCode} />}
            {meta?.kind === 'squad' && (
                <TbCirclesRelation size={16} style={{ flexShrink: 0, opacity: 0.75 }} />
            )}

            <Text size="sm" truncate="end">
                {node.label}
            </Text>

            {meta?.kind === 'node' && (
                <Group gap={4} style={{ flexShrink: 0 }} wrap="nowrap">
                    <span style={{ margin: '0 6px', opacity: 0.5 }}>›</span>
                    <XrayLogo size={14} />
                    <Text c="dimmed" size="xs">
                        {meta.configProfileName}
                    </Text>
                </Group>
            )}

            {meta && meta.kind !== 'inbound' && (
                <Badge color="gray" ml="auto" radius="sm" size="sm" variant="light">
                    {meta.count}
                </Badge>
            )}
        </Group>
    )
}

export function UserAccessibleNodesTree({ activeNodes }: { activeNodes: ActiveNode[] }) {
    const treeData = useMemo<UserAccessibleTreeNode[]>(
        () =>
            activeNodes.map((node) => ({
                value: `node:${node.uuid}`,
                label: node.nodeName,
                nodeProps: {
                    kind: 'node',
                    countryCode: node.countryCode,
                    configProfileName: node.configProfileName,
                    count: node.activeSquads.length
                },
                children: node.activeSquads.map((squad) => ({
                    value: `squad:${node.uuid}:${squad.squadName}`,
                    label: squad.squadName,
                    nodeProps: { kind: 'squad', count: squad.activeInbounds.length },
                    children: squad.activeInbounds.map((inbound, index) => ({
                        value: `inbound:${node.uuid}:${squad.squadName}:${index}`,
                        label: inbound,
                        nodeProps: { kind: 'inbound' }
                    }))
                }))
            })),
        [activeNodes]
    )

    return (
        <SectionCard.Root p="xs">
            <SectionCard.Section>
                <Tree
                    data={treeData}
                    expandOnClick
                    levelOffset={26}
                    renderNode={renderTreeNode}
                    withLines
                />
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
