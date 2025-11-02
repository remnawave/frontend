import { ActionIcon, Badge, Box, Center, Drawer, Group, Stack, Text } from '@mantine/core'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { PiProhibit, PiPulse, PiTag } from 'react-icons/pi'
import { TbAlertCircle, TbEyeOff } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import ColorHash from 'color-hash'
import { memo } from 'react'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { useGetConfigProfiles, useGetHosts } from '@shared/api/hooks'
import { SEARCH_PARAMS } from '@shared/constants/search-params'
import { XrayLogo } from '@shared/ui/logos'
import { ROUTES } from '@shared/constants'
import { LoadingScreen } from '@shared/ui'

import styles from './LinkedHosts.module.css'

export const LinkedHostsDrawer = memo(() => {
    const { isOpen, internalState: nodeUuid } = useModalState(MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER)
    const close = useModalClose(MODALS.SHOW_NODE_LINKED_HOSTS_DRAWER)

    const { t } = useTranslation()

    const { data: hosts } = useGetHosts()
    const { data: configProfiles } = useGetConfigProfiles()

    const navigate = useNavigate()

    if (!nodeUuid || !hosts || !configProfiles) {
        return (
            <Drawer
                keepMounted={false}
                onClose={close}
                opened={isOpen}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="lg"
                position="right"
                size="500px"
                title={t('linked-hosts-drawer.widget.assigned-hosts')}
            >
                <LoadingScreen />
            </Drawer>
        )
    }

    const linkedHosts = hosts.filter((host) => host.nodes.includes(nodeUuid.nodeUuid))

    return (
        <Drawer
            keepMounted={false}
            onClose={close}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="500px"
            title={t('linked-hosts-drawer.widget.assigned-hosts')}
        >
            <Stack gap="md">
                {linkedHosts.length === 0 && (
                    <Center>
                        <Text c="dimmed">
                            {t('linked-hosts-drawer.widget.no-hosts-assigned-to-this-node')}
                        </Text>
                    </Center>
                )}
                {linkedHosts.map((host) => {
                    const isHostActive = !host.isDisabled
                    const configProfile = configProfiles?.configProfiles.find(
                        (profile) => profile.uuid === host.inbound.configProfileUuid
                    )

                    const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

                    return (
                        <Box
                            className={styles.item}
                            onClick={() => {
                                close()

                                navigate({
                                    pathname: ROUTES.DASHBOARD.MANAGEMENT.HOSTS,
                                    search: createSearchParams({
                                        [SEARCH_PARAMS.HOST]: host.uuid
                                    }).toString()
                                })
                            }}
                        >
                            <Stack>
                                <Group
                                    flex={1}
                                    gap="sm"
                                    miw={0}
                                    style={{ overflow: 'hidden' }}
                                    wrap="nowrap"
                                >
                                    {!isHostActive && (
                                        <ActionIcon
                                            color="gray"
                                            size="md"
                                            style={{ flexShrink: 0 }}
                                            variant="light"
                                        >
                                            <PiProhibit size={16} />
                                        </ActionIcon>
                                    )}

                                    {isHostActive && host.isHidden && (
                                        <ActionIcon
                                            color="violet"
                                            size="md"
                                            style={{ flexShrink: 0 }}
                                            variant="light"
                                        >
                                            <TbEyeOff size={16} />
                                        </ActionIcon>
                                    )}

                                    {isHostActive && !host.isHidden && (
                                        <ActionIcon
                                            color="teal"
                                            size="md"
                                            style={{ flexShrink: 0 }}
                                            variant="light"
                                        >
                                            <PiPulse size={16} />
                                        </ActionIcon>
                                    )}

                                    <Group
                                        gap="md"
                                        style={{ flexShrink: 1, minWidth: 0 }}
                                        wrap="nowrap"
                                    >
                                        <Text fw={600} style={{ flexShrink: 0 }} truncate>
                                            {host.remark}
                                        </Text>
                                    </Group>
                                </Group>
                                <Group gap="md" style={{ flexShrink: 0 }} wrap="nowrap">
                                    <Text
                                        c="dimmed"
                                        className={styles.hostAddress}
                                        style={{ flexShrink: 1, minWidth: 0 }}
                                        truncate
                                    >
                                        {host.address}
                                        {host.port ? `:${host.port}` : ''}
                                    </Text>
                                </Group>
                                <Group gap="md" style={{ flexShrink: 0 }} wrap="nowrap">
                                    {host.inbound.configProfileInboundUuid && (
                                        <Badge
                                            autoContrast
                                            color={ch.hex(host.inbound.configProfileInboundUuid)}
                                            leftSection={<PiTag size={12} />}
                                            size="md"
                                            variant="outline"
                                        >
                                            {configProfile?.inbounds.find(
                                                (inbound) =>
                                                    inbound.uuid ===
                                                    host.inbound.configProfileInboundUuid
                                            )?.tag || 'UNKNOWN'}
                                        </Badge>
                                    )}

                                    <Badge
                                        autoContrast
                                        color={
                                            configProfile?.uuid ? ch.hex(configProfile.uuid) : 'red'
                                        }
                                        leftSection={
                                            configProfile?.uuid ? (
                                                <XrayLogo size={12} />
                                            ) : (
                                                <TbAlertCircle size={12} />
                                            )
                                        }
                                        size="md"
                                        variant="light"
                                    >
                                        {configProfile?.name || 'DANGLING'}
                                    </Badge>
                                </Group>
                            </Stack>
                        </Box>
                    )
                })}
            </Stack>
        </Drawer>
    )
})
