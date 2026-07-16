import {
    Badge,
    getTreeExpandedState,
    Group,
    RenderTreeNodePayload,
    Text,
    Tree,
    TreeNodeData,
    useTree
} from '@mantine/core'
import {
    GetConfigProfilesCommand,
    GetHostsCommand,
    GetNodesCommand
} from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PiListChecks, PiTag } from 'react-icons/pi'
import { TbChevronRight, TbLink, TbLock } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { XrayLogo } from '@shared/ui/logos'
import { SectionCard } from '@shared/ui/section-card'

type TopologyConfigProfile = GetConfigProfilesCommand.Response['response']['configProfiles'][number]
type TopologyHost = GetHostsCommand.Response['response'][number]
type TopologyNode = GetNodesCommand.Response['response'][number]

type NodeInboundsHostsTreeMeta =
    | { active: boolean; hostsCount: number; kind: 'inbound'; type: string }
    | { address: string; countryCode: string; kind: 'node' }
    | { address: string; host: TopologyHost; kind: 'host'; linked: boolean }
    | { inboundsCount: number; kind: 'profile' }

interface NodeInboundsHostsTreeNode extends TreeNodeData {
    children?: NodeInboundsHostsTreeNode[]
    nodeProps: NodeInboundsHostsTreeMeta
}

interface IProps {
    configProfile: TopologyConfigProfile
    hosts: TopologyHost[]
    node: TopologyNode
}

export function NodeInboundsHostsTree(props: IProps) {
    const { configProfile, hosts, node } = props

    const { t } = useTranslation()

    const treeData = useMemo<NodeInboundsHostsTreeNode[]>(() => {
        const activeInboundUuids = new Set(
            node.configProfile.activeInbounds.map((inbound) => inbound.uuid)
        )

        const hostsByInbound = new Map<string, TopologyHost[]>()
        hosts.forEach((host) => {
            const inboundUuid = host.inbound.configProfileInboundUuid
            if (!inboundUuid) return
            hostsByInbound.set(inboundUuid, [...(hostsByInbound.get(inboundUuid) ?? []), host])
        })

        const inbounds = [...configProfile.inbounds].sort((a, b) => {
            const aActive = activeInboundUuids.has(a.uuid) ? 0 : 1
            const bActive = activeInboundUuids.has(b.uuid) ? 0 : 1
            return aActive - bActive
        })

        return [
            {
                children: [
                    {
                        children: inbounds.map((inbound) => {
                            const inboundHosts = hostsByInbound.get(inbound.uuid) ?? []

                            return {
                                children: inboundHosts.map((host) => ({
                                    label: host.remark,
                                    nodeProps: {
                                        address: `${host.address}${host.port ? `:${host.port}` : ''}`,
                                        host,
                                        kind: 'host' as const,
                                        linked: host.nodes.includes(node.uuid)
                                    },
                                    value: `host:${host.uuid}`
                                })),
                                label: inbound.tag,
                                nodeProps: {
                                    active: activeInboundUuids.has(inbound.uuid),
                                    hostsCount: inboundHosts.length,
                                    kind: 'inbound' as const,
                                    type: inbound.type
                                },
                                value: `inbound:${inbound.uuid}`
                            }
                        }),
                        label: configProfile.name,
                        nodeProps: {
                            inboundsCount: configProfile.inbounds.length,
                            kind: 'profile' as const
                        },
                        value: `profile:${configProfile.uuid}`
                    }
                ],
                label: node.name,
                nodeProps: {
                    address: node.address,
                    countryCode: node.countryCode,
                    kind: 'node' as const
                },
                value: `node:${node.uuid}`
            }
        ]
    }, [configProfile, hosts, node])

    const tree = useTree({
        initialExpandedState: getTreeExpandedState(treeData, [
            `node:${node.uuid}`,
            `profile:${configProfile.uuid}`
        ])
    })

    const renderTreeNode = ({
        node: treeNode,
        expanded,
        hasChildren,
        elementProps
    }: RenderTreeNodePayload) => {
        const meta = treeNode.nodeProps as NodeInboundsHostsTreeMeta | undefined
        const isInactiveInbound = meta?.kind === 'inbound' && !meta.active
        const isUnlinkedHost = meta?.kind === 'host' && !meta.linked

        return (
            <Group
                gap={8}
                py={4}
                wrap="nowrap"
                {...elementProps}
                onClick={
                    meta?.kind === 'host'
                        ? (event) => {
                              event.stopPropagation()
                              showModal('hosts_editHostDrawer', { host: meta.host })
                          }
                        : elementProps.onClick
                }
                style={{
                    ...elementProps.style,
                    opacity: isUnlinkedHost ? 0.5 : undefined
                }}
            >
                {hasChildren && (
                    <TbChevronRight
                        size={16}
                        style={{
                            flexShrink: 0,
                            opacity: 0.6,
                            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 150ms ease'
                        }}
                    />
                )}

                {!hasChildren && meta?.kind !== 'host' && (
                    <span style={{ flexShrink: 0, width: 16 }} />
                )}

                {meta?.kind === 'node' && <CountryFlag countryCode={meta.countryCode} />}

                {meta?.kind === 'profile' && <XrayLogo size={14} />}

                {meta?.kind === 'inbound' && (
                    <PiTag size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
                )}

                {meta?.kind === 'host' && (
                    <PiListChecks
                        size={14}
                        style={{ flexShrink: 0, marginLeft: 6, opacity: 0.6 }}
                    />
                )}

                {isInactiveInbound && (
                    <TbLock
                        color="var(--mantine-color-dark-2)"
                        size={14}
                        style={{ flexShrink: 0 }}
                    />
                )}

                <Text
                    c={isInactiveInbound ? 'dimmed' : undefined}
                    ff={meta?.kind === 'inbound' ? 'monospace' : undefined}
                    fw={meta?.kind === 'node' ? 600 : undefined}
                    size="sm"
                    truncate="end"
                >
                    {treeNode.label}
                </Text>

                {(meta?.kind === 'node' || meta?.kind === 'host') && (
                    <Text c="dimmed" ff="monospace" size="xs" truncate="end">
                        {meta.address}
                    </Text>
                )}

                {meta?.kind === 'profile' && (
                    <Badge color="gray" ml="auto" radius="sm" size="sm" variant="light">
                        {meta.inboundsCount}
                    </Badge>
                )}

                {meta?.kind === 'inbound' && (
                    <Group gap={4} ml="auto" style={{ flexShrink: 0 }} wrap="nowrap">
                        <Badge
                            color={meta.active ? 'cyan' : 'gray'}
                            radius="sm"
                            size="xs"
                            variant="light"
                        >
                            {meta.type}
                        </Badge>
                        <Badge color="gray" radius="sm" size="sm" variant="light">
                            {meta.hostsCount}
                        </Badge>
                    </Group>
                )}

                {meta?.kind === 'host' && meta.linked && (
                    <Badge
                        color="teal"
                        leftSection={<TbLink size={11} />}
                        ml="auto"
                        radius="sm"
                        size="xs"
                        style={{ flexShrink: 0 }}
                        variant="light"
                    >
                        {t('node-inbounds-hosts-drawer.widget.linked')}
                    </Badge>
                )}
            </Group>
        )
    }

    return (
        <SectionCard.Root p="xs">
            <SectionCard.Section>
                <Tree
                    data={treeData}
                    expandOnClick
                    levelOffset={26}
                    renderNode={renderTreeNode}
                    tree={tree}
                    withLines
                />
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
