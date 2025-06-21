import { PiArrowsClockwise, PiEmpty, PiPlus } from 'react-icons/pi'
import { useHotkeys, useMediaQuery } from '@mantine/hooks'
import { Box, Button, Group, Text } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import { useMemo, useState } from 'react'
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
    const isMobile = useMediaQuery('(max-width: 768px)')

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
            title: 'Delete Infra Billing Record',
            children: (
                <Text size="sm">
                    Are you sure you want to delete this infra billing record?
                    <br />
                    This action is irreversible.
                </Text>
            ),
            labels: {
                confirm: 'Delete',
                cancel: 'Cancel'
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
        <DataTableShared.Container mb="xl" shadow="lg" w={isMobile ? '100%' : '40%'}>
            <DataTableShared.Title
                actions={
                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <Button
                            leftSection={<PiArrowsClockwise size="1rem" />}
                            loading={infraBillingRecordsLoading}
                            onClick={() => {
                                refetchInfraBillingRecords()
                            }}
                            size="xs"
                            variant="default"
                        >
                            Refresh
                        </Button>

                        <Button
                            leftSection={<PiPlus size="1rem" />}
                            onClick={() => {
                                openModal(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)
                            }}
                            size="xs"
                            variant="outline"
                        >
                            Create Record
                        </Button>
                    </Group>
                }
                description="List of all infra billing records sorted by date"
                title="Infra Billing Records"
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraBillingRecordsColumns(handleDeleteInfraBillingRecord)}
                fetching={infraBillingRecordsLoading}
                height={700}
                noRecordsIcon={
                    <Box mb={4} p={4}>
                        <PiEmpty size={36} strokeWidth={1.5} />
                    </Box>
                }
                noRecordsText="No records found"
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
            <DataTableShared.Content />
        </DataTableShared.Container>
    )
}
