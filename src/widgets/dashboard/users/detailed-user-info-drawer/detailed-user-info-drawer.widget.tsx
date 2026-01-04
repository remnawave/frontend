import {
    PiArrowsDownUpDuotone,
    PiCalendarDotDuotone,
    PiClockDuotone,
    PiNetworkDuotone,
    PiTagDuotone,
    PiUserDuotone
} from 'react-icons/pi'
import { Box, Center, Drawer, Group, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import {
    useUserModalStoreActions,
    useUserModalStoreDrawerUserUuid,
    useUserModalStoreIsDetailedUserInfoDrawerOpen
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { SectionCardSection } from '@shared/ui/section-card/section-card.section'
import { useEncryptSubscriptionLink, useGetUserByUuid } from '@shared/api/hooks'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCardRoot } from '@shared/ui/section-card/section-card.root'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'

import { UserStatusBadge } from '../user-status-badge/user-status-badge.widget'

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
                    <SectionCardRoot>
                        <SectionCardSection>
                            <Group align="flex-center" justify="space-between">
                                <BaseOverlayHeader
                                    IconComponent={PiUserDuotone}
                                    iconVariant="gradient-blue"
                                    title={t('detailed-user-info-drawer.widget.user-information')}
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
                        </SectionCardSection>
                        <SectionCardSection>
                            <Stack gap="xs">
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
                        </SectionCardSection>
                    </SectionCardRoot>
                    <SectionCardRoot>
                        <SectionCardSection>
                            <BaseOverlayHeader
                                IconComponent={PiArrowsDownUpDuotone}
                                iconVariant="gradient-teal"
                                title={t('detailed-user-info-drawer.widget.traffic-information')}
                            />
                        </SectionCardSection>
                        <SectionCardSection>
                            <Stack gap="xs">
                                <CopyableFieldShared
                                    label={t('detailed-user-info-drawer.widget.used-traffic')}
                                    value={
                                        prettyBytesToAnyUtil(
                                            user.userTraffic.usedTrafficBytes || 0
                                        ) || '—'
                                    }
                                />
                                <CopyableFieldShared
                                    label={t(
                                        'detailed-user-info-drawer.widget.lifetime-used-traffic'
                                    )}
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
                                    label={t(
                                        'detailed-user-info-drawer.widget.traffic-limit-strategy'
                                    )}
                                    value={user.trafficLimitStrategy}
                                />
                                <CopyableFieldShared
                                    label={t('detailed-user-info-drawer.widget.last-traffic-reset')}
                                    value={formatDate(user.lastTrafficResetAt)}
                                />
                            </Stack>
                        </SectionCardSection>
                    </SectionCardRoot>
                    <SectionCardRoot>
                        <SectionCardSection>
                            <BaseOverlayHeader
                                IconComponent={PiCalendarDotDuotone}
                                iconVariant="gradient-orange"
                                title={t(
                                    'detailed-user-info-drawer.widget.subscription-information'
                                )}
                            />
                        </SectionCardSection>
                        <SectionCardSection>
                            <Stack gap="xs">
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
                        </SectionCardSection>
                    </SectionCardRoot>

                    <SectionCardRoot>
                        <SectionCardSection>
                            <BaseOverlayHeader
                                IconComponent={PiNetworkDuotone}
                                iconVariant="gradient-violet"
                                title={t('detailed-user-info-drawer.widget.connection-information')}
                            />
                        </SectionCardSection>
                        <SectionCardSection>
                            <Stack gap="xs">
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
                                    label={t(
                                        'detailed-user-info-drawer.widget.last-connected-node'
                                    )}
                                    value={user.userTraffic.lastConnectedNodeUuid || '—'}
                                />
                            </Stack>
                        </SectionCardSection>
                    </SectionCardRoot>

                    {user.activeInternalSquads && user.activeInternalSquads.length > 0 && (
                        <SectionCardRoot>
                            <SectionCardSection>
                                <BaseOverlayHeader
                                    IconComponent={PiTagDuotone}
                                    iconVariant="gradient-green"
                                    title={t(
                                        'detailed-user-info-drawer.widget.active-internal-squads'
                                    )}
                                />
                            </SectionCardSection>
                            <SectionCardSection>
                                <Stack gap="xs">
                                    {user.activeInternalSquads.map((squad) => (
                                        <CopyableFieldShared
                                            key={squad.uuid}
                                            label={squad.name}
                                            value={squad.uuid}
                                        />
                                    ))}
                                </Stack>
                            </SectionCardSection>
                        </SectionCardRoot>
                    )}
                    <SectionCardRoot>
                        <SectionCardSection>
                            <BaseOverlayHeader
                                IconComponent={PiClockDuotone}
                                iconVariant="gradient-gray"
                                title={t('detailed-user-info-drawer.widget.timestamps')}
                            />
                        </SectionCardSection>
                        <SectionCardSection>
                            <Stack gap="xs">
                                <CopyableFieldShared
                                    label={t('detailed-user-info-drawer.widget.created-at')}
                                    value={formatDate(user.createdAt.toString())}
                                />
                            </Stack>
                            <Stack gap="xs">
                                <CopyableFieldShared
                                    label={t('detailed-user-info-drawer.widget.updated-at')}
                                    value={formatDate(user.updatedAt.toString())}
                                />
                            </Stack>
                        </SectionCardSection>
                    </SectionCardRoot>
                </Stack>
            )}
        </Drawer>
    )
}
