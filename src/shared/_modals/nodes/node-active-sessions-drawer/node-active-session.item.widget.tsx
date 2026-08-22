import { ActionIcon, Badge, Box, Group, Stack, Text, Tooltip } from '@mantine/core'
import { ConnectionsByNodeResultCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiEmptyDuotone, PiUserCircle } from 'react-icons/pi'
import {
    TbClockCheck,
    TbClockExclamation,
    TbClockPause,
    TbExternalLink,
    TbId
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { formatRelativeDateUtil, formatTimeUtil } from '@shared/utils/time-utils'

interface IProps {
    user: NonNullable<
        ConnectionsByNodeResultCommand.Response['response']['result']
    >['users'][number]
}

const getLastSeenIndicator = (lastSeen: Date | string) => {
    const diffMs = Date.now() - new Date(lastSeen).getTime()
    const diffMinutes = diffMs / 60_000
    if (diffMinutes <= 5) return { color: 'var(--mantine-color-teal-6)', Icon: TbClockCheck }
    if (diffMinutes <= 60) return { color: 'var(--mantine-color-yellow-6)', Icon: TbClockPause }
    return { color: 'var(--mantine-color-red-6)', Icon: TbClockExclamation }
}

export const NodeActiveSessionItem = (props: IProps) => {
    const { user } = props

    const { t, i18n } = useTranslation()

    const handleViewUser = () => {
        showModal('users_viewUserModal', {
            userId: user.userId
        })
    }

    return (
        <SectionCard.Root gap="xs" key={user.userId} onlyFirstDivider={true} allDividers={false}>
            <SectionCard.Section>
                <Group gap="xs" justify="space-between">
                    <BaseOverlayHeader
                        hideIcon
                        icon={
                            <Tooltip label={t('node-active-session.item.widget.view-user')}>
                                <ActionIcon
                                    color="cyan"
                                    onClick={handleViewUser}
                                    size="lg"
                                    variant="soft"
                                >
                                    <PiUserCircle size={20} />
                                </ActionIcon>
                            </Tooltip>
                        }
                        iconColor="blue"
                        IconComponent={TbId}
                        iconVariant="soft"
                        title={user.userId.toString()}
                    />

                    <Group gap="xs">
                        <Badge color="teal" size="lg" variant="default">
                            {user.ips.length}
                        </Badge>
                    </Group>
                </Group>
            </SectionCard.Section>

            {user.ips.length === 0 && <EmptyPageLayout icon={<PiEmptyDuotone size="3rem" />} />}

            {user.ips.length > 0 &&
                user.ips.map((item) => (
                    <Group align="center" gap="xs" key={item.ip} wrap="nowrap">
                        <ActionIcon
                            color="cyan"
                            component="a"
                            href={`https://ipinfo.io/${item.ip}`}
                            rel="noopener noreferrer"
                            size="input-sm"
                            target="_blank"
                            variant="soft"
                        >
                            <TbExternalLink size={18} />
                        </ActionIcon>

                        <Box style={{ flex: 1 }}>
                            <CopyableFieldShared
                                leftSection={
                                    <Tooltip
                                        label={
                                            <Stack gap={2} p={4}>
                                                <Text c="white" fw={600} size="xs">
                                                    {formatRelativeDateUtil(
                                                        item.lastSeen,
                                                        t,
                                                        i18n.language
                                                    )}
                                                </Text>
                                                <Text c="dimmed" ff="monospace" size="xs">
                                                    {formatTimeUtil({
                                                        time: item.lastSeen,
                                                        template: 'TIME_FIRST_DATETIME',
                                                        language: i18n.language
                                                    })}
                                                </Text>
                                            </Stack>
                                        }
                                        radius="md"
                                    >
                                        {(() => {
                                            const { color, Icon } = getLastSeenIndicator(
                                                item.lastSeen
                                            )
                                            return (
                                                <Box
                                                    style={{
                                                        display: 'flex',
                                                        cursor: 'help',
                                                        color
                                                    }}
                                                >
                                                    <Icon size={16} />
                                                </Box>
                                            )
                                        })()}
                                    </Tooltip>
                                }
                                size="sm"
                                value={item.ip}
                            />
                        </Box>
                    </Group>
                ))}
        </SectionCard.Root>
    )
}
