import {
    ActionIcon,
    ActionIconGroup,
    Box,
    Button,
    Group,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { useHotkeys } from '@mantine/hooks'
import { useMemo, useState } from 'react'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import {
    useDeleteInfraBillingHistoryRecord,
    useGetInfraBillingHistoryRecords
} from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { DataTableShared } from '@shared/ui/table'

import { getInfraBillingRecordsColumns } from './use-infra-billing-records-columns'

const PAGE_SIZE = 50

export function InfraBillingRecordsTableWidget() {
    const [page, setPage] = useState(1)

    const {
        data: infraBillingRecords,
        isFetching: infraBillingRecordsLoading,
        refetch: refetchInfraBillingRecords
    } = useGetInfraBillingHistoryRecords({
        query: {
            start: (page - 1) * PAGE_SIZE,
            size: PAGE_SIZE
        }
    })
    const { open: openModal } = useModalsStore()
    const { t } = useTranslation()

    useHotkeys([['mod + K', () => openModal(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)]])

    const memoizedInfraBillingRecords = useMemo(() => infraBillingRecords, [infraBillingRecords])

    const { mutate: deleteInfraBillingRecord } = useDeleteInfraBillingHistoryRecord({
        mutationFns: {
            onSuccess: () => {
                refetchInfraBillingRecords()
            }
        }
    })

    const handleDeleteInfraBillingRecord = (uuid: string) =>
        modals.openConfirmModal({
            title: t('infra-billing-records-table.widget.delete-infra-billing-record'),
            children: (
                <Text size="sm">
                    {t(
                        'infra-billing-records-table.widget.delete-infra-billing-record-confirmation'
                    )}
                    <br />
                    {t('infra-billing-records-table.widget.this-action-is-irreversible')}
                </Text>
            ),
            labels: {
                confirm: t('infra-billing-records-table.widget.delete'),
                cancel: t('infra-billing-records-table.widget.cancel')
            },

            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => {
                deleteInfraBillingRecord({
                    route: {
                        uuid
                    }
                })
            }
        })

    return (
        <DataTableShared.Container shadow="lg">
            <DataTableShared.Title
                actions={
                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <ActionIconGroup>
                            <Tooltip
                                label={t('infra-billing-records-table.widget.refresh')}
                                withArrow
                            >
                                <ActionIcon
                                    loading={infraBillingRecordsLoading}
                                    onClick={() => {
                                        refetchInfraBillingRecords()
                                    }}
                                    radius="md"
                                    size="lg"
                                    variant="light"
                                >
                                    <TbRefresh size="18px" />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIconGroup>

                        <ActionIconGroup>
                            <Tooltip
                                label={t('infra-billing-records-table.widget.create')}
                                withArrow
                            >
                                <ActionIcon
                                    color="teal"
                                    onClick={() => {
                                        openModal(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)
                                    }}
                                    radius="md"
                                    size="lg"
                                    variant="light"
                                >
                                    <TbPlus size="18px" />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIconGroup>
                    </Group>
                }
                description={t('infra-billing-records-table.widget.billing-records-sorted-by-date')}
                title={t('infra-billing-records-table.widget.infra-billing-records')}
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraBillingRecordsColumns(handleDeleteInfraBillingRecord, t)}
                emptyState={
                    <Stack align="center" gap="xs">
                        <Box mb={4} p={4}>
                            <PiEmpty size={36} strokeWidth={1.5} />
                        </Box>
                        <Text c="dimmed" size="sm">
                            {t('infra-billing-records-table.widget.no-billing-records-found')}
                        </Text>
                        <Button
                            onClick={() => openModal(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)}
                            style={{ pointerEvents: 'all' }}
                            variant="light"
                        >
                            {t('infra-billing-records-table.widget.create')}
                        </Button>
                    </Stack>
                }
                fetching={infraBillingRecordsLoading}
                height={600}
                onPageChange={(page) => {
                    setPage(page)
                }}
                page={page}
                records={memoizedInfraBillingRecords?.records ?? []}
                recordsPerPage={PAGE_SIZE}
                totalRecords={memoizedInfraBillingRecords?.total ?? 0}
                withColumnBorders
                withTableBorder={false}
            />
        </DataTableShared.Container>
    )
}
