import { Badge, Group, HoverCard, ScrollArea, Stack, Text } from '@mantine/core'
import { TNodeIps } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'

import { NodeIpStatusIcon } from './node-ip-status-icon'
import { resolveNodeIpStatusMeta } from './node-ip-status.constants'

interface IProps {
    ips: null | TNodeIps | undefined
    maxVisible?: number
}

export const NodeIpsCompactView = (props: IProps) => {
    const { ips, maxVisible = 4 } = props

    const { t } = useTranslation()

    if (!ips?.length) {
        return (
            <Text c="dimmed" size="sm">
                —
            </Text>
        )
    }

    const visibleIps = ips.slice(0, maxVisible)
    const hiddenCount = ips.length - visibleIps.length

    return (
        <HoverCard openDelay={150} position="bottom-start" shadow="md" width={280} withArrow>
            <HoverCard.Target>
                <Group gap={4} wrap="nowrap">
                    {visibleIps.map((entry, index) => (
                        <NodeIpStatusIcon
                            key={`${entry.ip}-${index}`}
                            size="sm"
                            status={entry.status}
                        />
                    ))}

                    {hiddenCount > 0 && (
                        <Badge color="gray" radius="sm" size="sm" variant="soft">
                            +{hiddenCount}
                        </Badge>
                    )}
                </Group>
            </HoverCard.Target>

            <HoverCard.Dropdown p="xs">
                <Stack gap={6}>
                    <Text c="dimmed" fw={600} size="xs" tt="uppercase">
                        {t('common.field.ip-addresses')} · {ips.length}
                    </Text>

                    <ScrollArea.Autosize mah={260} type="auto">
                        <Stack gap={6}>
                            {ips.map((entry, index) => (
                                <Group gap={8} key={`${entry.ip}-${index}`} wrap="nowrap">
                                    <NodeIpStatusIcon size="sm" status={entry.status} />
                                    <Text ff="monospace" size="xs" style={{ flex: 1 }} truncate>
                                        {entry.ip}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(resolveNodeIpStatusMeta(entry.status).labelKey)}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>
                    </ScrollArea.Autosize>
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}
