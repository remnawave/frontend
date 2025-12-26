import {
    ActionIcon,
    Box,
    Card,
    Drawer,
    Group,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
    Transition
} from '@mantine/core'
import { TbDevices, TbRefresh, TbRewindBackward50 } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetUserSubscriptionRequestHistory } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'

import { UserSubscriptionRequestItem } from './user-subscription-request-item'
import classes from './user-subscription-requests.module.css'

export const UserSubscriptionRequestsDrawerWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState } = useModalState(MODALS.USER_SUBSCRIPTION_REQUESTS_DRAWER)
    const close = useModalClose(MODALS.USER_SUBSCRIPTION_REQUESTS_DRAWER)

    const {
        data: subscriptionRequestHistory,
        isLoading,
        isRefetching,
        refetch
    } = useGetUserSubscriptionRequestHistory({
        route: {
            uuid: internalState?.userUuid ?? ''
        },
        rQueryParams: {
            enabled: isOpen
        }
    })

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
                                        {subscriptionRequestHistory?.total ?? 0}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        Total records
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
                            </Group>
                        </Group>
                    </Stack>
                </Card>

                {subscriptionRequestHistory?.total && subscriptionRequestHistory.total > 0 ? (
                    <Stack>
                        {subscriptionRequestHistory.records.map((record) => (
                            <UserSubscriptionRequestItem key={record.id} request={record} />
                        ))}
                    </Stack>
                ) : (
                    <EmptyPageLayout />
                )}
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
            title={
                <BaseOverlayHeader
                    IconComponent={TbRewindBackward50}
                    iconVariant="gradient-teal"
                    title={t(
                        'get-user-subscription-request-history.feature.subscription-request-history'
                    )}
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
                {(styles) => <Box style={{ ...styles }}>{renderDrawerContent()}</Box>}
            </Transition>
        </Drawer>
    )
}
