import { ActionIcon, Badge, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbRadar, TbServer, TbUnlink } from 'react-icons/tb'

import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { SessionIpRowWidget } from './session-ip-row.widget'
import { ActiveSessionNode } from './use-user-active-sessions'

interface IProps {
    node: ActiveSessionNode
    onDropIp: (ip: string) => void
    onDropNode: () => void
}

export const NodeSessionsCardWidget = ({ node, onDropIp, onDropNode }: IProps) => {
    const { t } = useTranslation()

    return (
        <SectionCard.Root gap="sm" onlyFirstDivider={true} allDividers={false}>
            <SectionCard.Section>
                <Group gap="xs" justify="space-between">
                    <BaseOverlayHeader
                        countryCode={node.countryCode}
                        iconColor="blue"
                        IconComponent={TbServer}
                        iconVariant="soft"
                        title={node.nodeName}
                    />
                    <Group gap="xs">
                        <Badge color="teal" size="lg" variant="default">
                            {node.ips.length}
                        </Badge>
                        <Tooltip
                            label={t(
                                'user-active-session-drawer.widget.drop-all-user-connections-this-node'
                            )}
                        >
                            <ActionIcon
                                color="orange"
                                onClick={onDropNode}
                                size="lg"
                                variant="soft"
                            >
                                <TbUnlink size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </SectionCard.Section>

            {node.ips.length === 0 && <EmptyPageLayout icon={<TbRadar size="3rem" />} />}

            {node.ips.map((ip) => (
                <SessionIpRowWidget ip={ip} key={ip.ip} onDrop={() => onDropIp(ip.ip)} />
            ))}
        </SectionCard.Root>
    )
}
