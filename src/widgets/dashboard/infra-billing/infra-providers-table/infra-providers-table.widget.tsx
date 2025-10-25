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
import { GetInfraProvidersCommand } from '@remnawave/backend-contract'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'

import { QueryKeys, useDeleteInfraProvider, useGetInfraProviders } from '@shared/api/hooks'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
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

    const openModalWithData = useModalsStoreOpenWithData()

    const { t } = useTranslation()

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

                queryClient.refetchQueries({
                    queryKey: QueryKeys.infraBilling.getInfraBillingNodes.queryKey
                })
                queryClient.refetchQueries({
                    queryKey: QueryKeys.infraBilling.getInfraBillingHistoryRecords({
                        start: 0,
                        size: 50
                    }).queryKey
                })
            }
        }
    })

    const handleOpenModal = (
        row: GetInfraProvidersCommand.Response['response']['providers'][number]
    ) => {
        openModalWithData(MODALS.VIEW_INFRA_PROVIDER_DRAWER, row)
    }

    const handleDeleteInfraProvider = (uuid: string) =>
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
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
                        <ActionIconGroup>
                            <Tooltip label={t('common.refresh')} withArrow>
                                <ActionIcon
                                    loading={infraProvidersLoading}
                                    onClick={() => {
                                        queryClient.refetchQueries({
                                            queryKey:
                                                QueryKeys.infraBilling.getInfraProviders.queryKey
                                        })
                                    }}
                                    size="lg"
                                    variant="light"
                                >
                                    <TbRefresh size="18px" />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIconGroup>

                        <ActionIconGroup>
                            <Tooltip
                                label={t('infra-providers-table.widget.create-infra-provider')}
                                withArrow
                            >
                                <ActionIcon
                                    color="teal"
                                    onClick={() => {
                                        openModalWithData(
                                            MODALS.CREATE_INFRA_PROVIDER_DRAWER,
                                            undefined
                                        )
                                    }}
                                    size="lg"
                                    variant="light"
                                >
                                    <TbPlus size="18px" />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIconGroup>
                    </Group>
                }
                description={t('infra-providers-table.widget.list-of-all-infra-providers')}
                title={t('infra-providers-table.widget.infra-providers')}
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraProvidersColumns(
                    memoizedInfraProviders?.total ?? 0,
                    totalAmount ?? 0,
                    handleOpenModal,
                    handleDeleteInfraProvider,
                    t
                )}
                emptyState={
                    <Stack align="center" gap="xs">
                        <Box mb={4} p={4}>
                            <PiEmpty size={36} strokeWidth={1.5} />
                        </Box>
                        <Text c="dimmed" size="sm">
                            {t('infra-providers-table.widget.no-providers-found')}
                        </Text>
                        <Button
                            onClick={() =>
                                openModalWithData(MODALS.CREATE_INFRA_PROVIDER_DRAWER, undefined)
                            }
                            style={{ pointerEvents: 'all' }}
                            variant="light"
                        >
                            {t('infra-providers-table.widget.create-infra-provider')}
                        </Button>
                    </Stack>
                }
                fetching={infraProvidersLoading}
                height={600}
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
        </DataTableShared.Container>
    )
}
