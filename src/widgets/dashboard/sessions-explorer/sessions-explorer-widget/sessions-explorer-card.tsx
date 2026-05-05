import { ActionIcon, Badge, Box, Group, Tooltip } from '@mantine/core'
import { TbFingerprint, TbId, TbServer, TbSum } from 'react-icons/tb'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { forwardRef, memo, useMemo } from 'react'
import { GroupedVirtuoso } from 'react-virtuoso'
import { useTranslation } from 'react-i18next'
import { PiUserCircle } from 'react-icons/pi'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { isPwa } from '@shared/utils/open-or-navigate'
import { SectionCard } from '@shared/ui/section-card'
import { useResolveUser } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'

import type { AggregatedUser, AggregatedUserNode } from './use-sessions-explorer'

import { SessionsExplorerIpRow } from './sessions-explorer-ip-row'
import styles from './sessions-explorer.module.css'

interface FlatIp {
    ip: AggregatedUserNode['ips'][number]
    nodeUuid: string
}

interface IProps {
    highThreshold: number
    ipSearchQuery?: string
    midThreshold: number
    user: AggregatedUser
}

function getIpCountColor(count: number, mid: number, high: number): string {
    if (count >= high) return 'red'
    if (count >= mid) return 'yellow'
    return 'teal'
}

const StickyGroupWrapper = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    ({ className, style, ...rest }, ref) => (
        <div
            ref={ref}
            {...rest}
            className={className}
            style={{
                ...style
            }}
        />
    )
)

const TopItemListWrapper = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
    ({ style, ...rest }, ref) => <div ref={ref} {...rest} style={{ ...style, zIndex: 20 }} />
)

const virtuosoComponents = {
    Group: StickyGroupWrapper,
    TopItemList: TopItemListWrapper
}

export const SessionsExplorerCard = memo(
    ({ user, midThreshold, highThreshold, ipSearchQuery }: IProps) => {
        const { t } = useTranslation()
        const { mutateAsync: resolveUser, isPending: isLoading } = useResolveUser()
        const navigate = useNavigate()

        const userModalActions = useUserModalStoreActions()

        const { visibleNodes, groupCounts, flatIps } = useMemo(() => {
            const visible: AggregatedUserNode[] = []
            const counts: number[] = []
            const flat: FlatIp[] = []
            for (const node of user.nodes) {
                if (node.ips.length > 0) {
                    visible.push(node)
                    counts.push(node.ips.length)
                    for (const ip of node.ips) flat.push({ ip, nodeUuid: node.nodeUuid })
                }
            }
            return { visibleNodes: visible, groupCounts: counts, flatIps: flat }
        }, [user.nodes])

        const handleViewUser = async () => {
            const result = await resolveUser({
                variables: {
                    id: Number(user.userId)
                }
            })

            if (result.uuid) {
                if (isPwa()) {
                    const searchParams = createSearchParams({
                        [SEARCH_PARAMS.USER]: String(result.uuid)
                    })

                    navigate(`${ROUTES.DASHBOARD.MANAGEMENT.USERS}?${searchParams.toString()}`)
                }
                await userModalActions.setUserUuid(result.uuid)
                userModalActions.changeModalState(true)
            }
        }

        return (
            <SectionCard.Root dividerOpacity={0.2} gap={10}>
                <SectionCard.Section>
                    <Group gap="xs" justify="space-between" wrap="nowrap">
                        <BaseOverlayHeader
                            hideIcon
                            icon={
                                <Tooltip label={t('node-active-session.item.widget.view-user')}>
                                    <ActionIcon
                                        color="cyan"
                                        loading={isLoading}
                                        onClick={handleViewUser}
                                        size="lg"
                                        variant="soft"
                                    >
                                        <PiUserCircle size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            }
                            IconComponent={TbId}
                            iconVariant="soft"
                            title={user.userId}
                            titleOrder={5}
                            truncateTitle
                        />

                        <Group gap="xs" style={{ flexShrink: 0 }} wrap="nowrap">
                            <Tooltip label={t('sessions-explorer.widget.unique-ips')}>
                                <Badge
                                    color={getIpCountColor(
                                        user.uniqueIps,
                                        midThreshold,
                                        highThreshold
                                    )}
                                    leftSection={<TbFingerprint size={16} />}
                                    size="lg"
                                    variant="soft"
                                >
                                    {user.uniqueIps}
                                </Badge>
                            </Tooltip>

                            <Tooltip label={t('sessions-explorer.widget.total-ips')}>
                                <Badge
                                    leftSection={<TbSum size={16} />}
                                    size="lg"
                                    variant="default"
                                >
                                    {user.totalIps}
                                </Badge>
                            </Tooltip>
                        </Group>
                    </Group>
                </SectionCard.Section>

                <SectionCard.Section mt={-10} style={{ height: '400px' }}>
                    <GroupedVirtuoso
                        components={virtuosoComponents}
                        computeItemKey={(index, item) =>
                            item ? `${item.nodeUuid}-${item.ip.ip}` : `__group-${index}`
                        }
                        data={flatIps}
                        groupContent={(groupIndex) => {
                            const node = visibleNodes[groupIndex]
                            if (!node) return null
                            return (
                                <Box className={styles.stickyNodeHeader}>
                                    <Group justify="space-between" wrap="nowrap">
                                        <BaseOverlayHeader
                                            countryCode={node.countryCode}
                                            hideIcon
                                            iconColor="blue"
                                            IconComponent={TbServer}
                                            iconVariant="soft"
                                            title={node.nodeName}
                                            titleOrder={6}
                                        />

                                        <Badge color="teal" size="lg" variant="default">
                                            {node.ips.length}
                                        </Badge>
                                    </Group>
                                </Box>
                            )
                        }}
                        groupCounts={groupCounts}
                        itemContent={(_, __, item) => (
                            <SessionsExplorerIpRow
                                ip={item.ip}
                                isMatch={!!ipSearchQuery && item.ip.ip.includes(ipSearchQuery)}
                            />
                        )}
                        style={{ height: '100%' }}
                    />
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }
)
