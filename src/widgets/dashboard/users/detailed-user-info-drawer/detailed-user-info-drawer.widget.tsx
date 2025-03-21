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
import { InfoFieldShared } from '@shared/ui/info-field/info-field'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { useGetUserByUuid } from '@shared/api/hooks'

export const DetailerUserInfoDrawerWidget = () => {
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
            size="xl"
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
                                <Badge color={user.status === 'ACTIVE' ? 'green' : 'red'}>
                                    {user.status}
                                </Badge>
                            </Group>

                            <CopyableFieldShared
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label="Uuid"
                                value={user.uuid}
                            />
                            <CopyableFieldShared
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label="Short UUID"
                                value={user.shortUuid}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.username')}
                                value={user.username}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.email')}
                                value={user.email}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.telegram-id')}
                                value={user.telegramId}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.description')}
                                value={user.description}
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

                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.used-traffic')}
                                value={prettyBytesToAnyUtil(user.usedTrafficBytes || 0)}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.lifetime-used-traffic')}
                                value={prettyBytesToAnyUtil(user.lifetimeUsedTrafficBytes || 0)}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.traffic-limit')}
                                value={prettyBytesToAnyUtil(user.trafficLimitBytes || 0)}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.traffic-limit-strategy')}
                                value={user.trafficLimitStrategy}
                            />
                            <InfoFieldShared
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
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label={t('detailed-user-info-drawer.widget.subscription-uuid')}
                                value={user.subscriptionUuid}
                            />
                            <CopyableFieldShared
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label={t('detailed-user-info-drawer.widget.subscription-url')}
                                value={user.subscriptionUrl}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.expires-at')}
                                value={formatDate(user.expireAt)}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.last-opened-at')}
                                value={formatDate(user.subLastOpenedAt)}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.last-user-agent')}
                                value={user.subLastUserAgent}
                            />
                            <InfoFieldShared
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
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label={t('detailed-user-info-drawer.widget.trojan-password')}
                                value={user.trojanPassword}
                            />
                            <CopyableFieldShared
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label={t('detailed-user-info-drawer.widget.vless-uuid')}
                                value={user.vlessUuid}
                            />
                            <CopyableFieldShared
                                copiedText={t('detailed-user-info-drawer.widget.copied')}
                                copyText={t('detailed-user-info-drawer.widget.copy')}
                                label={t('detailed-user-info-drawer.widget.ss-password')}
                                value={user.ssPassword}
                            />
                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.last-online')}
                                value={user.onlineAt ? formatDate(user.onlineAt.toString()) : '—'}
                            />
                            <InfoFieldShared
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
                                                <PiTag size="1.2rem" />
                                                <Text fw={600} size="md">
                                                    {inbound.tag}
                                                </Text>
                                            </Group>

                                            <Group gap="xs">
                                                <Badge color={'green'} size="lg">
                                                    {inbound.type}
                                                </Badge>

                                                {inbound.network && (
                                                    <Badge
                                                        color="grape"
                                                        leftSection={<PiGlobe size="1.1rem" />}
                                                        size="lg"
                                                    >
                                                        {inbound.network}
                                                    </Badge>
                                                )}
                                                {inbound.security && (
                                                    <Badge
                                                        color="gray"
                                                        leftSection={<PiLockSimple size="1.1rem" />}
                                                        size="lg"
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

                            <InfoFieldShared
                                label={t('detailed-user-info-drawer.widget.created-at')}
                                value={formatDate(user.createdAt.toString())}
                            />
                            <InfoFieldShared
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
