import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { DataList, Drawer, Group, Stack } from '@mantine/core'
import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'
import { useTranslation } from 'react-i18next'
import {
    PiArrowsDownUpDuotone,
    PiCalendarDotDuotone,
    PiClockDuotone,
    PiNetworkDuotone,
    PiTagDuotone,
    PiUserDuotone
} from 'react-icons/pi'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetUserById } from '@shared/api/hooks'
import { CopyableDataListItem } from '@shared/ui/copyable-field/copyable-data-list-item'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { prettifyBytesUtil } from '@shared/utils/bytes'
import { formatTimeUtil } from '@shared/utils/time-utils'

interface IProps {
    userId: number
}

export const DetailedUserInfoDrawer = NiceModal.create((props: IProps) => {
    const { userId } = props

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { t, i18n } = useTranslation()

    const { data: user, isLoading: isUserLoading } = useGetUserById({
        route: {
            userId: userId
        }
    })

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="blue"
                    IconComponent={PiUserDuotone}
                    iconVariant="soft"
                    title={t('detailed-user-info-drawer.widget.detailed-user-info')}
                />
            }
        >
            {isUserLoading && <LoaderModalShared mih="80vh" />}

            {!isUserLoading && user && (
                <Stack gap="md">
                    <SectionCard.Root>
                        <SectionCard.Section>
                            <Group align="center" justify="space-between">
                                <BaseOverlayHeader
                                    iconColor="blue"
                                    IconComponent={PiUserDuotone}
                                    iconVariant="soft"
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
                        </SectionCard.Section>
                        <SectionCard.Section>
                            <DataList withDivider orientation="vertical">
                                <CopyableDataListItem label="ID" monospace value={user.id} />

                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.short-uuid')}
                                    monospace
                                    value={user.shortUuid}
                                />
                                <CopyableDataListItem
                                    label={t('common.field.username')}
                                    value={user.username}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.email')}
                                    value={user.email}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.telegram-id')}
                                    monospace
                                    value={user.telegramId}
                                />
                                <CopyableDataListItem
                                    label={t('common.field.description')}
                                    value={user.description}
                                />
                                <CopyableDataListItem
                                    label={t('common.field.tag')}
                                    value={user.tag}
                                />
                            </DataList>
                        </SectionCard.Section>
                    </SectionCard.Root>
                    <SectionCard.Root>
                        <SectionCard.Section>
                            <BaseOverlayHeader
                                iconColor="teal"
                                IconComponent={PiArrowsDownUpDuotone}
                                iconVariant="soft"
                                title={t('detailed-user-info-drawer.widget.traffic-information')}
                            />
                        </SectionCard.Section>
                        <SectionCard.Section>
                            <DataList withDivider orientation="vertical">
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.used-traffic')}
                                    value={prettifyBytesUtil(user.userTraffic.usedTrafficBytes)}
                                />
                                <CopyableDataListItem
                                    label={t(
                                        'detailed-user-info-drawer.widget.lifetime-used-traffic'
                                    )}
                                    value={prettifyBytesUtil(
                                        user.userTraffic.lifetimeUsedTrafficBytes
                                    )}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.traffic-limit')}
                                    value={prettifyBytesUtil(user.trafficLimitBytes)}
                                />
                                <CopyableDataListItem
                                    label={t(
                                        'detailed-user-info-drawer.widget.traffic-limit-strategy'
                                    )}
                                    value={user.trafficLimitStrategy}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.last-traffic-reset')}
                                    value={formatTimeUtil({
                                        time: user.lastTrafficResetAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                            </DataList>
                        </SectionCard.Section>
                    </SectionCard.Root>
                    <SectionCard.Root>
                        <SectionCard.Section>
                            <BaseOverlayHeader
                                iconColor="orange"
                                IconComponent={PiCalendarDotDuotone}
                                iconSize={16}
                                iconVariant="soft"
                                title={t(
                                    'detailed-user-info-drawer.widget.subscription-information'
                                )}
                            />
                        </SectionCard.Section>
                        <SectionCard.Section>
                            <DataList withDivider orientation="vertical">
                                <CopyableDataListItem
                                    label={t('common.field.subscription-url')}
                                    monospace
                                    value={user.subscriptionUrl}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.expires-at')}
                                    value={formatTimeUtil({
                                        time: user.expireAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.revoked-at')}
                                    value={formatTimeUtil({
                                        time: user.subRevokedAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                            </DataList>
                        </SectionCard.Section>
                    </SectionCard.Root>

                    <SectionCard.Root>
                        <SectionCard.Section>
                            <BaseOverlayHeader
                                iconColor="violet"
                                IconComponent={PiNetworkDuotone}
                                iconVariant="soft"
                                title={t('detailed-user-info-drawer.widget.connection-information')}
                            />
                        </SectionCard.Section>
                        <SectionCard.Section>
                            <DataList withDivider orientation="vertical">
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.trojan-password')}
                                    monospace
                                    value={user.trojanPassword}
                                />
                                <CopyableDataListItem
                                    label="Vless/Hysteria2 UUID"
                                    monospace
                                    value={user.vlessUuid}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.ss-password')}
                                    monospace
                                    value={user.ssPassword}
                                />
                                <CopyableDataListItem
                                    label={t('common.field.first-connected-at')}
                                    value={formatTimeUtil({
                                        time: user.userTraffic.firstConnectedAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                                <CopyableDataListItem
                                    label={t('detailed-user-info-drawer.widget.last-online')}
                                    value={formatTimeUtil({
                                        time: user.userTraffic.onlineAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                                <CopyableDataListItem
                                    label={t(
                                        'detailed-user-info-drawer.widget.last-connected-node'
                                    )}
                                    monospace
                                    value={user.userTraffic.lastConnectedNodeUuid}
                                />
                            </DataList>
                        </SectionCard.Section>
                    </SectionCard.Root>

                    {user.activeInternalSquads && user.activeInternalSquads.length > 0 && (
                        <SectionCard.Root>
                            <SectionCard.Section>
                                <BaseOverlayHeader
                                    iconColor="green"
                                    IconComponent={PiTagDuotone}
                                    iconVariant="soft"
                                    title={t(
                                        'detailed-user-info-drawer.widget.active-internal-squads'
                                    )}
                                />
                            </SectionCard.Section>
                            <SectionCard.Section>
                                <DataList withDivider orientation="vertical">
                                    {user.activeInternalSquads.map((squad) => (
                                        <CopyableDataListItem
                                            key={squad.uuid}
                                            label={squad.name}
                                            monospace
                                            value={squad.uuid}
                                        />
                                    ))}
                                </DataList>
                            </SectionCard.Section>
                        </SectionCard.Root>
                    )}
                    <SectionCard.Root>
                        <SectionCard.Section>
                            <BaseOverlayHeader
                                iconColor="gray"
                                IconComponent={PiClockDuotone}
                                iconVariant="soft"
                                title={t('detailed-user-info-drawer.widget.timestamps')}
                            />
                        </SectionCard.Section>
                        <SectionCard.Section>
                            <DataList withDivider orientation="vertical">
                                <CopyableDataListItem
                                    label={t('common.field.created-at')}
                                    value={formatTimeUtil({
                                        time: user.createdAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                                <CopyableDataListItem
                                    label={t('common.field.updated-at')}
                                    value={formatTimeUtil({
                                        time: user.updatedAt,
                                        template: 'TIME_FIRST_DATETIME',
                                        language: i18n.language
                                    })}
                                />
                            </DataList>
                        </SectionCard.Section>
                    </SectionCard.Root>
                </Stack>
            )}
        </Drawer>
    )
})
