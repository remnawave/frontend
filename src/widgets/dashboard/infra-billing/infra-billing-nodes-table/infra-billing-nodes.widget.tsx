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
import { GetInfraBillingNodesCommand } from '@remnawave/backend-contract'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'

import { useDeleteInfraBillingNode, useGetInfraBillingNodes } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { DataTableShared } from '@shared/ui/table'

import { getInfraBillingNodesColumns } from './use-infra-billing-nodes-columns'

const PAGE_SIZE = 500

export function InfraBillingNodesTableWidget() {
    const {
        data: infraBillingNodes,
        isFetching: infraBillingNodesLoading,
        refetch: refetchInfraBillingNodes
    } = useGetInfraBillingNodes()

    const { open: openModal, setInternalData } = useModalsStore()
    const { t } = useTranslation()

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
            title: t('infra-billing-nodes.widget.delete-infra-billing-node'),
            children: (
                <Text size="sm">
                    {t('infra-billing-nodes.widget.delete-infra-billing-node-confirmation')}
                    <br />
                    {t('infra-billing-nodes.widget.this-action-is-irreversible')}
                </Text>
            ),
            labels: {
                confirm: t('infra-billing-nodes.widget.delete'),
                cancel: t('infra-billing-nodes.widget.cancel')
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
        <DataTableShared.Container shadow="lg">
            <DataTableShared.Title
                actions={
                    <Group gap="xs">
                        <ActionIconGroup>
                            <Tooltip label={t('infra-billing-nodes.widget.refresh')} withArrow>
                                <ActionIcon
                                    loading={infraBillingNodesLoading}
                                    onClick={() => {
                                        refetchInfraBillingNodes()
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
                            <Tooltip label={t('infra-billing-nodes.widget.add-node')} withArrow>
                                <ActionIcon
                                    color="teal"
                                    onClick={() => {
                                        openModal(MODALS.CREATE_INFRA_BILLING_NODE_MODAL)
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
                description={t('infra-billing-nodes.widget.list-of-all-infra-billing-nodes')}
                title={t('infra-billing-nodes.widget.infra-billing-nodes')}
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraBillingNodesColumns(handleDeleteInfraBillingNode, t)}
                emptyState={
                    <Stack align="center" gap="xs">
                        <Box mb={4} p={4}>
                            <PiEmpty size={36} strokeWidth={1.5} />
                        </Box>
                        <Text c="dimmed" size="sm">
                            {t('infra-billing-nodes.widget.no-nodes-found')}
                        </Text>
                        <Button
                            onClick={() => openModal(MODALS.CREATE_INFRA_BILLING_NODE_MODAL)}
                            style={{ pointerEvents: 'all' }}
                            variant="light"
                        >
                            {t('infra-billing-nodes.widget.add-a-node')}
                        </Button>
                    </Stack>
                }
                fetching={infraBillingNodesLoading}
                height={600}
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
        </DataTableShared.Container>
    )
}
