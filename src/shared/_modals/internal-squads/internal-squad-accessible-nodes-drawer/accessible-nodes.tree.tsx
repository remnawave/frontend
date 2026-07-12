import { Badge, RenderTreeNodePayload, Tree, TreeNodeData } from '@mantine/core'
import { Group, Text } from '@mantine/core'
import { GetInternalSquadAccessibleNodesCommand } from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { PiTag } from 'react-icons/pi'
import { TbChevronRight } from 'react-icons/tb'

import { CountryFlag } from '@shared/ui/get-country-flag'
import { XrayLogo } from '@shared/ui/logos'
import { SectionCard } from '@shared/ui/section-card'

type AccessibleNode =
    GetInternalSquadAccessibleNodesCommand.Response['response']['accessibleNodes'][number]

type AccessibleTreeMeta =
    | { configProfileName: string; count: number; countryCode: string; kind: 'node' }
    | { kind: 'inbound' }

interface AccessibleTreeNode extends TreeNodeData {
    children?: AccessibleTreeNode[]
    nodeProps: AccessibleTreeMeta
}

const renderTreeNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) => {
    const meta = node.nodeProps as AccessibleTreeMeta | undefined

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

            {meta?.kind === 'node' && (
                <Badge color="gray" ml="auto" radius="sm" size="sm" variant="light">
                    {meta.count}
                </Badge>
            )}
        </Group>
    )
}

export function AccessibleNodesTree({ accessibleNodes }: { accessibleNodes: AccessibleNode[] }) {
    const treeData = useMemo<AccessibleTreeNode[]>(
        () =>
            accessibleNodes.map((node) => ({
                value: `node:${node.uuid}`,
                label: node.nodeName,
                nodeProps: {
                    kind: 'node',
                    countryCode: node.countryCode,
                    configProfileName: node.configProfileName,
                    count: node.activeInbounds.length
                },
                children: node.activeInbounds.map((inbound, index) => ({
                    value: `inbound:${node.uuid}:${index}`,
                    label: inbound,
                    nodeProps: { kind: 'inbound' }
                }))
            })),
        [accessibleNodes]
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
