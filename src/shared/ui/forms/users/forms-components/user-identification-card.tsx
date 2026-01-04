import {
    ActionIcon,
    Code,
    Group,
    HoverCard,
    Paper,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { GetUserByUuidCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { TbCalendar, TbChartArcs, TbUser, TbWifi } from 'react-icons/tb'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { PiLinkDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import dayjs from 'dayjs'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { resolveCountryCode } from '@shared/utils/misc/resolve-country-code'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { CopyableCodeBlock } from '@shared/ui/copyable-code-block'
import { prettyBytesUtil } from '@shared/utils/bytes'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    cardVariants: Variants
    lastConnectedNode?: null | { countryCode: string; name: string }
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    openTrafficStatisticsModal: () => void
    user: GetUserByUuidCommand.Response['response']
}

const statusIconVariantMap = {
    [USERS_STATUS.ACTIVE]: 'gradient-teal',
    [USERS_STATUS.DISABLED]: 'gradient-gray',
    [USERS_STATUS.EXPIRED]: 'gradient-red',
    [USERS_STATUS.LIMITED]: 'gradient-yellow'
} as const

export const UserIdentificationCard = memo((props: IProps) => {
    const { t } = useTranslation()

    const { cardVariants, lastConnectedNode, motionWrapper, openTrafficStatisticsModal, user } =
        props

    const MotionWrapper = motionWrapper

    const actions = useUserModalStoreActions()

    const statusIconVariant = statusIconVariantMap[user.status] ?? 'gradient-gray'

    const usedBytes = user.userTraffic.usedTrafficBytes
    const limitBytes = user.trafficLimitBytes
    const lifetimeBytes = user.userTraffic.lifetimeUsedTrafficBytes
    const isUnlimited = limitBytes === 0
    const percentage = isUnlimited ? 0 : Math.floor((usedBytes * 100) / limitBytes)

    const prettyUsedData = prettyBytesUtil(usedBytes) || '0 B'
    const prettyLifetimeData = prettyBytesUtil(lifetimeBytes) || '0 B'
    const maxData = isUnlimited ? '∞' : prettyBytesUtil(limitBytes) || '∞'

    const getProgressColor = () => {
        if (isUnlimited) return 'teal'
        if (percentage > 95) return 'red'
        if (percentage > 80) return 'yellow.4'
        return 'teal'
    }

    const expireDate = dayjs(user.expireAt)
    const daysLeft = expireDate.diff(dayjs(), 'day')
    const isExpired = daysLeft !== null && daysLeft <= 0
    const expirationFormattedDate = expireDate?.format('DD.MM.YYYY HH:mm')

    const getExpirationStyle = () => {
        if (isExpired) {
            return {
                bg: 'rgba(239, 68, 68, 0.08)',
                border: 'rgba(239, 68, 68, 0.2)',
                color: 'red.5',
                iconColor: 'var(--mantine-color-red-5)'
            }
        }
        if (daysLeft !== null && daysLeft <= 7) {
            return {
                bg: 'rgba(251, 191, 36, 0.10)',
                border: 'rgba(251, 191, 36, 0.2)',
                color: 'yellow.4',
                iconColor: 'var(--mantine-color-yellow-4)'
            }
        }
        return {
            bg: 'rgba(45, 212, 191, 0.08)',
            border: 'rgba(45, 212, 191, 0.2)',
            color: 'teal.5',
            iconColor: 'var(--mantine-color-teal-5)'
        }
    }

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <Group align="flex-center" justify="space-between">
                        <BaseOverlayHeader
                            IconComponent={TbUser}
                            iconSize={20}
                            iconVariant={statusIconVariant}
                            subtitle={user.id.toString()}
                            title={user.username}
                            titleOrder={5}
                            withCopy
                        />

                        <Group gap="xs">
                            <UserStatusBadge
                                h={28}
                                key="view-user-status-badge"
                                size="lg"
                                status={user.status}
                            />
                        </Group>
                    </Group>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Group gap="xs" justify="space-between" mb={6}>
                        <Group gap={6}>
                            <Text c="gray.3" ff="monospace" fw={600} size="sm">
                                {prettyUsedData}
                            </Text>
                        </Group>
                        <Text c="dimmed" size="xs">
                            {maxData}
                        </Text>
                    </Group>

                    <Progress
                        color={getProgressColor()}
                        radius="sm"
                        size="sm"
                        value={isUnlimited ? 100 : percentage}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    <SimpleGrid
                        cols={{
                            base: 1,
                            xs: 2,
                            sm: 2
                        }}
                        spacing="xs"
                    >
                        <Paper
                            bd={`1px solid ${getExpirationStyle().border}`}
                            bg={getExpirationStyle().bg}
                            onClick={async () => {
                                await actions.setDrawerUserUuid(user.uuid)
                                actions.changeDetailedUserInfoDrawerState(true)
                            }}
                            p="xs"
                            radius="md"
                            style={{
                                cursor: 'pointer'
                            }}
                        >
                            <Tooltip
                                label={`${t('use-table-columns.expire-at')}: ${expirationFormattedDate}`}
                            >
                                <Group gap="xs" justify="center">
                                    <TbCalendar color={getExpirationStyle().iconColor} size={18} />
                                    <Text c={getExpirationStyle().color} fw={600} size="sm">
                                        {expirationFormattedDate}
                                    </Text>
                                </Group>
                            </Tooltip>
                        </Paper>

                        <Paper
                            bd="1px solid rgba(99, 102, 241, 0.2)"
                            bg="rgba(99, 102, 241, 0.08)"
                            onClick={openTrafficStatisticsModal}
                            p="xs"
                            radius="md"
                            style={{
                                cursor: 'pointer'
                            }}
                        >
                            <Tooltip
                                label={t('detailed-user-info-drawer.widget.lifetime-used-traffic')}
                            >
                                <Group gap="xs" justify="center">
                                    <TbChartArcs color="var(--mantine-color-indigo-5)" size={18} />
                                    <Text c="indigo.5" fw={600} size="sm">
                                        {prettyLifetimeData}
                                    </Text>
                                </Group>
                            </Tooltip>
                        </Paper>

                        {user.userTraffic.onlineAt && (
                            <Paper
                                bd="1px solid rgba(139, 92, 246, 0.2)"
                                bg="rgba(139, 92, 246, 0.08)"
                                p="xs"
                                radius="md"
                            >
                                <Tooltip label={t('detailed-user-info-drawer.widget.last-online')}>
                                    <Group gap="xs" justify="center">
                                        <TbWifi color="var(--mantine-color-violet-5)" size={18} />
                                        <Text c="violet.5" fw={600} size="sm">
                                            {dayjs(user.userTraffic.onlineAt).format(
                                                'DD.MM.YYYY HH:mm'
                                            )}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}

                        {lastConnectedNode && (
                            <Paper
                                bd="1px solid rgba(6, 182, 212, 0.2)"
                                bg="rgba(6, 182, 212, 0.08)"
                                p="xs"
                                radius="md"
                            >
                                <Tooltip
                                    label={t(
                                        'detailed-user-info-drawer.widget.last-connected-node'
                                    )}
                                >
                                    <Group align="center" gap="xs" justify="center" wrap="nowrap">
                                        {resolveCountryCode(lastConnectedNode.countryCode, 20)}

                                        <Text c="cyan.5" fw={600} size="sm" truncate>
                                            {lastConnectedNode.name}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}
                    </SimpleGrid>
                </SectionCard.Section>

                <SectionCard.Section>
                    <CopyableFieldShared
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={500} fz="sm">
                                    {t('view-user-modal.widget.subscription-url')}
                                </Text>
                                <HoverCard shadow="md" width={280} withArrow>
                                    <HoverCard.Target>
                                        <ActionIcon color="gray" mb={2} size="xs" variant="subtle">
                                            <HiQuestionMarkCircle size={16} />
                                        </ActionIcon>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Stack gap="sm">
                                            <Text fw={600} size="sm">
                                                {t('view-user-modal.widget.subscription-url')}
                                            </Text>
                                            <Text c="dimmed" size="sm">
                                                {t(
                                                    'view-user-modal.widget.subscription-url-description-line-1'
                                                )}{' '}
                                                <Code bg="gray.1" c="dark.4" fw={700}>
                                                    SUB_PUBLIC_DOMAIN
                                                </Code>
                                                <br />
                                                {t(
                                                    'view-user-modal.widget.subscription-url-description-line-2'
                                                )}
                                            </Text>
                                            <CopyableCodeBlock value="docker compose down && docker compose up -d" />
                                        </Stack>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            </Group>
                        }
                        leftSection={<PiLinkDuotone size="16px" />}
                        value={user.subscriptionUrl}
                    />
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
})
