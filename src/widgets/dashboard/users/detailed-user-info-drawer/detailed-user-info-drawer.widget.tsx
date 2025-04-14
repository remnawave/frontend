import {
    PiArrowsDownUpDuotone,
    PiCalendarDotDuotone,
    PiClockDuotone,
    PiGlobe,
    PiLockSimple,
    PiNetworkDuotone,
    PiTag,
    PiTagDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import {
    Badge,
    Box,
    Center,
    Drawer,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import {
    useUserModalStoreActions,
    useUserModalStoreDrawerUserUuid,
    useUserModalStoreIsDetailedUserInfoDrawerOpen
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { useGetUserByUuid } from '@shared/api/hooks'

export const DetailedUserInfoDrawerWidget = () => {
    const { t } = useTranslation()

    const actions = useUserModalStoreActions()
    const isDetailedUserInfoDrawerOpen = useUserModalStoreIsDetailedUserInfoDrawerOpen()
    const selectedUser = useUserModalStoreDrawerUserUuid()

    const cleanUpDrawer = async () => {
        actions.changeDetailedUserInfoDrawerState(false)
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
                <Group>
                    <Text fw={500}>{t('detailed-user-info-drawer.widget.detailed-user-info')}</Text>
                </Group>
            }
        >
            {isUserLoading && (
                <Center h={'100%'} mt="md" py="xl" ta="center">
                    <Box>
                        <LoaderModalShared
                            text={t('detailed-user-info-drawer.widget.loading-user-info')}
                        />
                    </Box>
                </Center>
            )}

            {!isUserLoading && user && (
                <Stack gap="md">
                    <Paper p="md" radius="md" withBorder>
                        <Stack gap="xs">
                            <Group justify="flex-start">
                                <Group>
                                    <ThemeIcon
                                        autoContrast
                                        color="blue"
                                        radius="md"
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

                            <CopyableFieldShared label="Uuid" value={user.uuid} />
                            <CopyableFieldShared label="Short UUID" value={user.shortUuid} />
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
                        </Stack>
                    </Paper>

                    <Paper p="md" radius="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="teal" radius="md" size="md" variant="outline">
                                    <PiArrowsDownUpDuotone size={16} />
                                </ThemeIcon>
                                <Title order={5}>
                                    {t('detailed-user-info-drawer.widget.traffic-information')}
                                </Title>
                            </Group>

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.used-traffic')}
                                value={prettyBytesToAnyUtil(user.usedTrafficBytes || 0) || '—'}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.lifetime-used-traffic')}
                                value={
                                    prettyBytesToAnyUtil(user.lifetimeUsedTrafficBytes || 0) || '—'
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

                    <Paper p="md" radius="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="orange" radius="md" size="md" variant="outline">
                                    <PiCalendarDotDuotone size={16} />
                                </ThemeIcon>
                                <Title order={5}>
                                    {t('detailed-user-info-drawer.widget.subscription-information')}
                                </Title>
                            </Group>

                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.subscription-uuid')}
                                value={user.subscriptionUuid}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.subscription-url')}
                                value={user.subscriptionUrl}
                            />
                            <CopyableFieldShared
                                label={'Happ Crypto Link'}
                                value={user.happ.cryptoLink}
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

                    <Paper p="md" radius="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="violet" radius="md" size="md" variant="outline">
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
                                label={t('detailed-user-info-drawer.widget.last-online')}
                                value={user.onlineAt ? formatDate(user.onlineAt.toString()) : '—'}
                            />
                            <CopyableFieldShared
                                label={t('detailed-user-info-drawer.widget.last-connected-node')}
                                value={user.lastConnectedNode?.nodeName || '—'}
                            />
                        </Stack>
                    </Paper>

                    {user.activeUserInbounds && user.activeUserInbounds.length > 0 && (
                        <Paper p="md" radius="md" withBorder>
                            <Stack gap="xs">
                                <Group>
                                    <ThemeIcon
                                        color="green"
                                        radius="md"
                                        size="md"
                                        variant="outline"
                                    >
                                        <PiTagDuotone size={16} />
                                    </ThemeIcon>
                                    <Title order={5}>
                                        {t('detailed-user-info-drawer.widget.active-inbounds')}
                                    </Title>
                                </Group>

                                {user.activeUserInbounds.map((inbound) => (
                                    <Paper
                                        key={inbound.uuid}
                                        p="md"
                                        radius="md"
                                        shadow="sm"
                                        withBorder
                                    >
                                        <Group justify="space-between">
                                            <Group gap="xs">
                                                <PiTag size="1rem" />
                                                <Text fw={600} size="sm">
                                                    {inbound.tag}
                                                </Text>
                                            </Group>

                                            <Group gap="xs">
                                                <Badge color={'green'} size="md">
                                                    {inbound.type}
                                                </Badge>

                                                {inbound.network && (
                                                    <Badge
                                                        color="grape"
                                                        leftSection={<PiGlobe size="1rem" />}
                                                        size="md"
                                                    >
                                                        {inbound.network}
                                                    </Badge>
                                                )}
                                                {inbound.security && (
                                                    <Badge
                                                        color="gray"
                                                        leftSection={<PiLockSimple size="1rem" />}
                                                        size="md"
                                                    >
                                                        {inbound.security}
                                                    </Badge>
                                                )}
                                            </Group>
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    <Paper p="md" radius="md" withBorder>
                        <Stack gap="xs">
                            <Group>
                                <ThemeIcon color="gray" radius="md" size="md" variant="outline">
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
