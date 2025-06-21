import { GetInfraProvidersCommand } from '@remnawave/backend-contract'
import { PiArrowsClockwise, PiEmpty, PiPlus } from 'react-icons/pi'
import { Box, Button, Group, Text } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'

import { QueryKeys, useDeleteInfraProvider, useGetInfraProviders } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { DataTableShared } from '@shared/ui/table'
import { queryClient } from '@shared/api'

import { getInfraProvidersColumns } from './use-infra-providers-columns'

const PAGE_SIZE = 500

export function InfraProvidersTableWidget() {
    const {
        data: infraProviders,
        isFetching: infraProvidersLoading,
        refetch: refetchInfraProviders
    } = useGetInfraProviders()
    const { open: openModal, setInternalData } = useModalsStore()

    const memoizedInfraProviders = useMemo(() => infraProviders, [infraProviders])

    const totalAmount = useMemo(() => {
        return memoizedInfraProviders?.providers.reduce(
            (acc, provider) => acc + provider.billingHistory.totalAmount,
            0
        )
    }, [memoizedInfraProviders])

    const { mutate: deleteInfraProvider } = useDeleteInfraProvider({
        mutationFns: {
            onSuccess: () => {
                refetchInfraProviders()
            }
        }
    })

    const handleOpenModal = (
        row: GetInfraProvidersCommand.Response['response']['providers'][number]
    ) => {
        setInternalData({
            internalState: row,
            modalKey: MODALS.VIEW_INFRA_PROVIDER_DRAWER
        })
        openModal(MODALS.VIEW_INFRA_PROVIDER_DRAWER)
    }

    const handleDeleteInfraProvider = (uuid: string) =>
        modals.openConfirmModal({
            title: 'Delete Infra Provider',
            children: (
                <Text size="sm">
                    Are you sure you want to delete this infra provider?
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
                deleteInfraProvider({
                    route: {
                        uuid
                    }
                })
            }
        })

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={
                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <Button
                            leftSection={<PiArrowsClockwise size="1rem" />}
                            loading={infraProvidersLoading}
                            onClick={() => {
                                queryClient.refetchQueries({
                                    queryKey: QueryKeys.infraBilling.getInfraProviders.queryKey
                                })
                            }}
                            size="xs"
                            variant="default"
                        >
                            Update
                        </Button>

                        <Button
                            leftSection={<PiPlus size="1rem" />}
                            onClick={() => {
                                openModal(MODALS.CREATE_INFRA_PROVIDER_DRAWER)
                            }}
                            size="xs"
                            variant="default"
                        >
                            Create Infra Provider
                        </Button>
                    </Group>
                }
                description="List of all infra providers"
                title="Infra Providers"
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraProvidersColumns(
                    memoizedInfraProviders?.total ?? 0,
                    totalAmount ?? 0,
                    handleOpenModal,
                    handleDeleteInfraProvider
                )}
                fetching={infraProvidersLoading}
                height={400}
                noRecordsIcon={
                    <Box mb={4} p={4}>
                        <PiEmpty size={36} strokeWidth={1.5} />
                    </Box>
                }
                noRecordsText="No records found"
                onCellClick={({ record, column }) => {
                    if (record.loginUrl && column.accessor === 'loginUrl') {
                        window.open(record.loginUrl, '_blank', 'noopener,noreferrer')
                    }
                }}
                onPageChange={() => {}}
                page={1}
                records={memoizedInfraProviders?.providers ?? []}
                recordsPerPage={PAGE_SIZE}
                textSelectionDisabled
                totalRecords={memoizedInfraProviders?.total ?? 0}
                withColumnBorders
                withTableBorder={false}
            />
            <DataTableShared.Content />
        </DataTableShared.Container>
    )
}
