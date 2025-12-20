import {
    PiArrowsDownUpDuotone,
    PiCalendarDotDuotone,
    PiCheck,
    PiClockDuotone,
    PiCopy,
    PiNetworkDuotone,
    PiTag,
    PiTagDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import {
    ActionIcon,
    Badge,
    Box,
    Center,
    CopyButton,
    Drawer,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import {
    useUserModalStoreActions,
    useUserModalStoreDrawerUserUuid,
    useUserModalStoreIsDetailedUserInfoDrawerOpen
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { useEncryptSubscriptionLink, useGetUserByUuid } from '@shared/api/hooks'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

export const DetailedUserInfoDrawerWidget = () => {
    const { t } = useTranslation()
    const [encryptedSubscriptionLink, setEncryptedSubscriptionLink] = useState('')

    const actions = useUserModalStoreActions()
    const isDetailedUserInfoDrawerOpen = useUserModalStoreIsDetailedUserInfoDrawerOpen()
    const selectedUser = useUserModalStoreDrawerUserUuid()

    const cleanUpDrawer = async () => {
        actions.changeDetailedUserInfoDrawerState(false)
        setEncryptedSubscriptionLink('')
    }

    const isQueryEnabled = !!selectedUser

    const { data: user, isLoading: isUserLoading } = useGetUserByUuid({
        route: {
            uuid: selectedUser ?? ''
        },
        rQueryParams: {
            enabled: isQueryEnabled
        }
    })

    const { mutateAsync: encryptSubscriptionLink } = useEncryptSubscriptionLink()

    useEffect(() => {
        if (!user || !selectedUser) return
        encryptSubscriptionLink({
            variables: {
                linkToEncrypt: user.subscriptionUrl
            }
        })
            .then((result) => {
                setEncryptedSubscriptionLink(result.encryptedLink)
            })
            .catch(() => {})
    }, [selectedUser, user])

    const formatDate = (dateString: Date | null | string) => {
        if (!dateString) return '—'
        return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')
    }

    return (
        <Drawer
            keepMounted={true}
            onClose={cleanUpDrawer}
            opened={isDetailedUserInfoDrawerOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="lg"
            title={
                <BaseOverlayHeader
                    IconComponent={PiUserDuotone}
                    iconVariant="gradient-blue"
                    title={t('detailed-user-info-drawer.widget.detailed-user-info')}
                />
            }
            zIndex={1000}
        >
            {isUserLoading && (
                <Center h="100%" mt="md" py="xl" ta="center">
                    <Box>
                        <LoaderModalShared
                            text={t('detailed-user-info-drawer.widget.loading-user-info')}
                        />
                    </Box>
                </Center>
            )}

            {!isUserLoading && user && (
                <Stack gap="md">
                    <Paper p="md" withBorder>
                        <Stack gap="xs">
                            <Group justify="flex-start">
                                <Group>
                                    <ThemeIcon
                                        autoContrast
                                        color="blue"
                                        size="md"
                                        variant="outline"
                                    >
                                        <PiUserDuotone size={16} />
                                    </ThemeIcon>
                                    <Title order={5}>
                                        {t('detailed-user-info-drawer.widget.user-information')}
                                    </Title>
                                </Group>
                                <Badge color={user.status === 'ACTIVE' ? 'teal' : 'red'} size="md">
                                    {user.status}
                                </Badge>
                            </Group>

                            <CopyableFieldShared label="ID" value={user.id.toString()} />

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.uuid')}
                                value={user.uuid}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.short-uuid')}
                                value={user.shortUuid}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.username')}
                                value={user.username}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.email')}
                                value={user.email || '—'}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.telegram-id')}
                                value={user.telegramId || '—'}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.description')}
                                value={user.description || '—'}
                            />

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.tag')}
                                value={user.tag || '—'}
                            />
                        </Stack>
                    </Paper>

                    <Paper p="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="teal" size="md" variant="outline">
                                    <PiArrowsDownUpDuotone size={16} />
                                </ThemeIcon>
                                <Title order={5}>
                                    {t('detailed-user-info-drawer.widget.traffic-information')}
                                </Title>
                            </Group>

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.used-traffic')}
                                value={
                                    prettyBytesToAnyUtil(user.userTraffic.usedTrafficBytes || 0) ||
                                    '—'
                                }
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.lifetime-used-traffic')}
                                value={
                                    prettyBytesToAnyUtil(
                                        user.userTraffic.lifetimeUsedTrafficBytes || 0
                                    ) || '—'
                                }
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.traffic-limit')}
                                value={prettyBytesToAnyUtil(user.trafficLimitBytes || 0) || '—'}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.traffic-limit-strategy')}
                                value={user.trafficLimitStrategy}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.last-traffic-reset')}
                                value={formatDate(user.lastTrafficResetAt)}
                            />
                        </Stack>
                    </Paper>

                    <Paper p="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="orange" size="md" variant="outline">
                                    <PiCalendarDotDuotone size={16} />
                                </ThemeIcon>
                                <Title order={5}>
                                    {t('detailed-user-info-drawer.widget.subscription-information')}
                                </Title>
                            </Group>

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.subscription-url')}
                                value={user.subscriptionUrl}
                            />
                            <CopyableFieldShared
                                label="Happ Crypto Link"
                                value={encryptedSubscriptionLink}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.expires-at')}
                                value={formatDate(user.expireAt)}
                            />

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.last-opened-at')}
                                value={formatDate(user.subLastOpenedAt)}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.last-user-agent')}
                                value={user.subLastUserAgent || '—'}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.revoked-at')}
                                value={formatDate(user.subRevokedAt)}
                            />
                        </Stack>
                    </Paper>

                    <Paper p="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="violet" size="md" variant="outline">
                                    <PiNetworkDuotone size={16} />
                                </ThemeIcon>
                                <Title order={5}>
                                    {t('detailed-user-info-drawer.widget.connection-information')}
                                </Title>
                            </Group>

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.trojan-password')}
                                value={user.trojanPassword}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.vless-uuid')}
                                value={user.vlessUuid}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.ss-password')}
                                value={user.ssPassword}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.first-connected-at')}
                                value={formatDate(user.userTraffic.firstConnectedAt)}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.last-online')}
                                value={
                                    user.userTraffic.onlineAt
                                        ? formatDate(user.userTraffic.onlineAt.toString())
                                        : '—'
                                }
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.last-connected-node')}
                                value={user.userTraffic.lastConnectedNodeUuid || '—'}
                            />
                        </Stack>
                    </Paper>

                    {user.activeInternalSquads && user.activeInternalSquads.length > 0 && (
                        <Paper p="md" withBorder>
                            <Stack gap="xs">
                                <Group>
                                    <ThemeIcon color="green" size="md" variant="outline">
                                        <PiTagDuotone size={16} />
                                    </ThemeIcon>
                                    <Title order={5}>
                                        {t(
                                            'detailed-user-info-drawer.widget.active-internal-squads'
                                        )}
                                    </Title>
                                </Group>

                                {user.activeInternalSquads.map((squad) => (
                                    <Paper key={squad.uuid} p="md" shadow="sm" withBorder>
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <PiTag size="16px" />
                                                <Text fw={600} size="sm">
                                                    {squad.name}
                                                </Text>

                                                <CopyButton timeout={2000} value={squad.uuid}>
                                                    {({ copied, copy }) => (
                                                        <Tooltip
                                                            label={copied ? 'Copied!' : 'Copy UUID'}
                                                        >
                                                            <ActionIcon
                                                                color={copied ? 'teal' : 'gray'}
                                                                onClick={copy}
                                                                size="sm"
                                                                variant="subtle"
                                                            >
                                                                {copied ? (
                                                                    <PiCheck size={14} />
                                                                ) : (
                                                                    <PiCopy size={14} />
                                                                )}
                                                            </ActionIcon>
                                                        </Tooltip>
                                                    )}
                                                </CopyButton>
                                            </Group>
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    <Paper p="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="gray" size="md" variant="outline">
                                    <PiClockDuotone size={16} />
                                </ThemeIcon>
                                <Title order={5}>
                                    {t('detailed-user-info-drawer.widget.timestamps')}
                                </Title>
                            </Group>

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.created-at')}
                                value={formatDate(user.createdAt.toString())}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.updated-at')}
                                value={formatDate(user.updatedAt.toString())}
                            />
                        </Stack>
                    </Paper>
                </Stack>
            )}
        </Drawer>
    )
}
