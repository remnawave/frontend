import { GetInfraBillingNodesCommand } from '@remnawave/backend-contract'
import { PiArrowsClockwise, PiEmpty, PiPlus } from 'react-icons/pi'
import { Box, Button, Group, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'

import { useDeleteInfraBillingNode, useGetInfraBillingNodes } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { DataTableShared } from '@shared/ui/table'

import { getInfraBillingNodesColumns } from './use-infra-billing-nodes-columns'

const PAGE_SIZE = 500

export function InfraBillingNodesTableWidget() {
    const isMobile = useMediaQuery('(max-width: 768px)')

    const {
        data: infraBillingNodes,
        isFetching: infraBillingNodesLoading,
        refetch: refetchInfraBillingNodes
    } = useGetInfraBillingNodes()

    const { open: openModal, setInternalData } = useModalsStore()

    const memoizedInfraBillingNodes = useMemo(() => infraBillingNodes, [infraBillingNodes])

    const { mutate: deleteInfraBillingNode } = useDeleteInfraBillingNode({
        mutationFns: {
            onSuccess: () => {
                refetchInfraBillingNodes()
            }
        }
    })

    const handleDeleteInfraBillingNode = (uuid: string) =>
        modals.openConfirmModal({
            title: 'Delete Infra Billing Node',
            children: (
                <Text size="sm">
                    Are you sure you want to delete this infra billing node?
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
                deleteInfraBillingNode({
                    route: {
                        uuid
                    }
                })
            }
        })

    const handleClickBillingAt = (
        node: GetInfraBillingNodesCommand.Response['response']['billingNodes'][number]
    ) => {
        setInternalData({
            internalState: node,
            modalKey: MODALS.UPDATE_BILLING_DATE_MODAL
        })
        openModal(MODALS.UPDATE_BILLING_DATE_MODAL)
    }

    return (
        <DataTableShared.Container mb="xl" shadow="lg" w={isMobile ? '100%' : '58%'}>
            <DataTableShared.Title
                actions={
                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <Button
                            leftSection={<PiArrowsClockwise size="1rem" />}
                            loading={infraBillingNodesLoading}
                            onClick={() => {
                                refetchInfraBillingNodes()
                            }}
                            size="xs"
                            variant="default"
                        >
                            Refresh
                        </Button>

                        <Button
                            leftSection={<PiPlus size="1rem" />}
                            onClick={() => {
                                openModal(MODALS.CREATE_INFRA_BILLING_NODE_MODAL)
                            }}
                            size="xs"
                            variant="outline"
                        >
                            Create Node
                        </Button>
                    </Group>
                }
                description="List of all infra billing nodes sorted by next billing date"
                title="Infra Billing Nodes"
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraBillingNodesColumns(handleDeleteInfraBillingNode)}
                fetching={infraBillingNodesLoading}
                height={700}
                noRecordsIcon={
                    <Box mb={4} p={4}>
                        <PiEmpty size={36} strokeWidth={1.5} />
                    </Box>
                }
                noRecordsText="No records found"
                onCellClick={({ record, column }) => {
                    if (record.provider.loginUrl && column.accessor === 'provider.name') {
                        window.open(record.provider.loginUrl, '_blank', 'noopener,noreferrer')
                    }
                    if (column.accessor === 'nextBillingAt') {
                        handleClickBillingAt(record)
                    }
                }}
                onPageChange={() => {}}
                page={1}
                records={memoizedInfraBillingNodes?.billingNodes ?? []}
                recordsPerPage={PAGE_SIZE}
                totalRecords={memoizedInfraBillingNodes?.totalBillingNodes ?? 0}
                withColumnBorders
                withTableBorder={false}
            />
            <DataTableShared.Content />
        </DataTableShared.Container>
    )
}
