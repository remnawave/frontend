import NiceModal, { useModal } from '@ebay/nice-modal-react'
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
import { useTranslation } from 'react-i18next'
import { TbFlame, TbRefresh } from 'react-icons/tb'
import { Virtuoso } from 'react-virtuoso'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetTorrentBlockerReports } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { UserTorrentBlockerReportItem } from './user-torrent-blocker-report-item'
import classes from './user-torrent-blocker-reports.module.css'

interface IProps {
    userId: number
}

export const UserTorrentBlockerReportsModal = NiceModal.create((props: IProps) => {
    const { userId } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const {
        data: reports,
        isLoading,
        isRefetching,
        refetch
    } = useGetTorrentBlockerReports({
        query: {
            start: 0,
            size: 1000,
            filters: [
                {
                    id: 'userId',
                    value: userId
                }
            ],
            filterModes: {
                userId: 'equals'
            }
        }
    })

    const renderListContent = () => {
        if (!reports || reports.total === 0) return null
        return (
            <Box className={classes.listContainer}>
                <Virtuoso
                    data={reports.records}
                    itemContent={(_, report) => {
                        return (
                            <Box className={classes.itemWrapper}>
                                <UserTorrentBlockerReportItem report={report} />
                            </Box>
                        )
                    }}
                    style={{
                        height: '100%'
                    }}
                    totalCount={reports.total}
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
                                <ThemeIcon color="indigo" radius="md" size="xl" variant="soft">
                                    <TbFlame size={24} />
                                </ThemeIcon>
                                <Stack gap={0}>
                                    <Text c="white" fw={700} size="xl">
                                        {reports?.total ?? 0}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'user-torrent-blocker-reports.drawer.widget.total-reports'
                                        )}
                                    </Text>
                                </Stack>
                            </Group>
                            <Group gap="xs">
                                <Tooltip label={t('common.action.refresh')}>
                                    <ActionIcon
                                        color="indigo"
                                        loading={isRefetching}
                                        onClick={() => refetch()}
                                        size="lg"
                                        variant="soft"
                                    >
                                        <TbRefresh size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>
                    </Stack>
                </Card>

                {reports && reports.total > 0 ? (
                    renderListContent()
                ) : (
                    <EmptyPageLayout icon={<TbFlame size="32" />} />
                )}
            </Stack>
        )
    }

    return (
        <Drawer
            {...modalProps}
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
                    iconColor="red"
                    IconComponent={TbFlame}
                    iconVariant="soft"
                    title={t('constants.tb-reports')}
                />
            }
        >
            {isLoading && <LoaderModalShared mih="80vh" />}

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
})
