import {
    ActionIcon,
    Box,
    Card,
    Group,
    Loader,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { TbDevices, TbRefresh, TbTrash } from 'react-icons/tb'
import { Virtuoso } from 'react-virtuoso'

import {
    QueryKeys,
    useDeleteAllUserHwidDevices,
    useDeleteUserHwidDevice,
    useGetUserHwidDevices
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'

import { UserHwidDeviceItem } from './user-hwid-device-item'
import classes from './user-hwid-devices.module.css'
import { UserHwidDevicesTable } from './user-hwid-devices.table'

interface IProps {
    mobile: boolean
    userId: number
}

export const UserHwidDevicesContentModal = (props: IProps) => {
    const { userId, mobile } = props
    const { t } = useTranslation()

    const {
        data: devices,
        isLoading,
        isFetching,
        refetch
    } = useGetUserHwidDevices({
        route: {
            userId
        }
    })

    const { mutate: deleteDevice } = useDeleteUserHwidDevice({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys['hwid-user-devices'].getUserHwidDevices({
                        userId
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
                        userId
                    }).queryKey,
                    data
                )
            }
        }
    })

    const handleDeleteDevice = (hwid: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            confirmProps: { color: 'red', variant: 'soft' },
            cancelProps: {
                variant: 'subtle'
            },
            centered: true,
            onConfirm: () => {
                deleteDevice({
                    variables: {
                        hwid,
                        userId
                    }
                })
            }
        })
    }

    const handleDeleteAllDevices = () => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            confirmProps: { color: 'red', variant: 'soft' },
            cancelProps: {
                variant: 'subtle'
            },
            centered: true,
            onConfirm: () => {
                deleteAllDevices({
                    variables: { userId }
                })
            }
        })
    }

    const renderListContent = () => {
        if (!devices || devices.devices.length === 0) return null
        return (
            <Box className={classes.listContainer}>
                <Virtuoso
                    data={devices.devices}
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
                    totalCount={devices.devices.length}
                    useWindowScroll={false}
                />
            </Box>
        )
    }

    return (
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack className={classes.drawerContent}>
                <Card withBorder>
                    <Stack gap="md">
                        <Group gap="sm" justify="space-between">
                            <Group>
                                <ThemeIcon color="indigo" radius="md" size="xl" variant="soft">
                                    <TbDevices size={24} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Box
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: 'calc(var(--mantine-font-size-xl) * var(--mantine-line-height))'
                                        }}
                                    >
                                        {isLoading ? (
                                            <Loader color="cyan" size="sm" type="oval" />
                                        ) : (
                                            <Text c="white" fw={700} size="xl">
                                                {devices?.devices.length ?? 0}
                                            </Text>
                                        )}
                                    </Box>
                                    <Text c="dimmed" size="xs">
                                        {t('get-hwid-user-devices.feature.devices')}
                                    </Text>
                                </Stack>
                            </Group>
                            <Group gap="xs">
                                <Tooltip label={t('common.action.refresh')}>
                                    <ActionIcon
                                        color="indigo"
                                        loading={isFetching}
                                        onClick={() => refetch()}
                                        size="lg"
                                        variant="soft"
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
                                        variant="soft"
                                    >
                                        <TbTrash size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>
                    </Stack>
                </Card>

                {mobile && !isLoading && devices?.devices.length === 0 && (
                    <EmptyPageLayout icon={<TbDevices size={32} />} />
                )}

                {mobile && isLoading && <LoaderModalShared mih="80vh" />}
                {mobile && !isLoading && renderListContent()}

                {!mobile && (
                    <Box className={classes.tableContainer}>
                        <UserHwidDevicesTable
                            devices={devices?.devices}
                            isLoading={isLoading}
                            onDelete={handleDeleteDevice}
                        />
                    </Box>
                )}
            </Stack>
        </Box>
    )
}
