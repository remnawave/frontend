import {
    ActionIcon,
    Box,
    Card,
    Drawer,
    Group,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import { TbDevices, TbRefresh, TbSearch, TbTrash } from 'react-icons/tb'
import { useDebouncedValue } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Virtuoso } from 'react-virtuoso'
import { useMemo, useState } from 'react'
import { modals } from '@mantine/modals'

import {
    QueryKeys,
    useDeleteAllUserHwidDevices,
    useDeleteUserHwidDevice,
    useGetUserHwidDevices
} from '@shared/api/hooks'
import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api/query-client'

import { UserHwidDeviceItem } from './user-hwid-device-item'
import classes from './user-hwid-devices.module.css'

export const UserHwidDevicesDrawerWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState } = useModalState(MODALS.USER_HWID_DEVICES_DRAWER)
    const close = useModalClose(MODALS.USER_HWID_DEVICES_DRAWER)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery] = useDebouncedValue(searchQuery, 200)

    const {
        data: devices,
        isLoading,
        isRefetching,
        refetch
    } = useGetUserHwidDevices({
        route: {
            userUuid: internalState?.userUuid ?? ''
        },
        rQueryParams: {
            enabled: isOpen
        }
    })

    const { mutate: deleteDevice } = useDeleteUserHwidDevice({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys['hwid-user-devices'].getUserHwidDevices({
                        userUuid: internalState?.userUuid ?? ''
                    }).queryKey,
                    data
                )
            }
        }
    })

    const { mutate: deleteAllDevices } = useDeleteAllUserHwidDevices({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys['hwid-user-devices'].getUserHwidDevices({
                        userUuid: internalState?.userUuid ?? ''
                    }).queryKey,
                    data
                )
            }
        }
    })

    const handleDeleteDevice = (hwid: string) => {
        if (!internalState || !internalState.userUuid) return

        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteDevice({
                    variables: {
                        hwid,
                        userUuid: internalState.userUuid
                    }
                })
            }
        })
    }

    const handleDeleteAllDevices = () => {
        if (!internalState || !internalState.userUuid) return

        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteAllDevices({
                    variables: { userUuid: internalState.userUuid }
                })
            }
        })
    }

    const filteredDevices = useMemo(() => {
        if (!devices || !devices.total || devices.devices.length === 0) return []
        if (!debouncedQuery.trim()) return devices.devices

        const query = debouncedQuery.toLowerCase()
        return devices.devices.filter((device) => {
            const searchableText = [
                device.hwid,
                device.platform,
                device.osVersion,
                device.deviceModel,
                device.userAgent
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return searchableText.includes(query)
        })
    }, [devices, debouncedQuery])

    const renderListContent = () => {
        if (!filteredDevices || filteredDevices.length === 0) return null
        return (
            <Box className={classes.listContainer}>
                <Virtuoso
                    data={filteredDevices}
                    itemContent={(index, device) => {
                        return (
                            <Box className={classes.itemWrapper}>
                                <UserHwidDeviceItem
                                    device={device}
                                    index={index}
                                    onDelete={handleDeleteDevice}
                                />
                            </Box>
                        )
                    }}
                    style={{
                        height: '100%'
                    }}
                    totalCount={filteredDevices.length}
                    useWindowScroll={false}
                />
            </Box>
        )
    }

    const renderDrawerContent = () => {
        return (
            <Stack className={classes.drawerContent}>
                <Card withBorder>
                    <Stack gap="md">
                        <Group gap="sm" justify="space-between">
                            <Group>
                                <ThemeIcon color="indigo" radius="md" size="xl" variant="light">
                                    <TbDevices size={24} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Text c="white" fw={700} size="xl">
                                        {filteredDevices.length}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t('get-hwid-user-devices.feature.devices')}
                                    </Text>
                                </Stack>
                            </Group>
                            <Group gap="xs">
                                <Tooltip label={t('common.refresh')}>
                                    <ActionIcon
                                        color="indigo"
                                        loading={isRefetching}
                                        onClick={() => refetch()}
                                        size="lg"
                                        variant="light"
                                    >
                                        <TbRefresh size={20} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip
                                    label={t('get-hwid-user-devices.feature.delete-all-devices')}
                                >
                                    <ActionIcon
                                        color="red"
                                        onClick={handleDeleteAllDevices}
                                        size="lg"
                                        variant="light"
                                    >
                                        <TbTrash size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>
                    </Stack>
                </Card>
                <TextInput
                    leftSection={<TbSearch size={20} />}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    placeholder={t('user-hwid-devices.drawer.widget.enter-search-query')}
                    radius="md"
                    size="md"
                    value={searchQuery}
                />

                {filteredDevices.length > 0 ? renderListContent() : <EmptyPageLayout />}
            </Stack>
        )
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={close}
            opened={isOpen}
            position="right"
            size="500px"
            styles={{
                body: {
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            title={
                <BaseOverlayHeader
                    IconComponent={TbDevices}
                    iconVariant="gradient-violet"
                    title={t('get-hwid-user-devices.feature.hwid-devices')}
                />
            }
        >
            {isLoading && <LoaderModalShared h="80vh" text="Loading..." w="100%" />}

            <Transition
                duration={300}
                mounted={!isLoading}
                timingFunction="ease-in-out"
                transition="fade"
            >
                {(styles) => (
                    <Box style={{ ...styles, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {renderDrawerContent()}
                    </Box>
                )}
            </Transition>
        </Drawer>
    )
}
