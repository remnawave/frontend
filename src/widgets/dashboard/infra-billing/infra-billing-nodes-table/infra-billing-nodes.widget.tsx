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
import { TbCalendar, TbPlus, TbRefresh, TbServer, TbTrash } from 'react-icons/tb'
import { GetInfraBillingNodesCommand } from '@remnawave/backend-contract'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { useMemo, useState } from 'react'
import { PiEmpty } from 'react-icons/pi'
import { modals } from '@mantine/modals'
import dayjs from 'dayjs'

import {
    QueryKeys,
    useDeleteInfraBillingNode,
    useGetInfraBillingNodes,
    useUpdateInfraBillingNode
} from '@shared/api/hooks'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { DataTableShared } from '@shared/ui/table'
import { queryClient } from '@shared/api'

import { getInfraBillingNodesColumns } from './use-infra-billing-nodes-columns'

const PAGE_SIZE = 500

export function InfraBillingNodesTableWidget() {
    const {
        data: infraBillingNodes,
        isFetching: infraBillingNodesLoading,
        refetch: refetchInfraBillingNodes
    } = useGetInfraBillingNodes()

    const openModalWithData = useModalsStoreOpenWithData()

    const { t } = useTranslation()

    const [multiSelectedRecords, setMultiSelectedRecords] = useState<
        GetInfraBillingNodesCommand.Response['response']['billingNodes']
    >([])

    const [updatingUuids, setUpdatingUuids] = useState<Set<string>>(new Set())

    const memoizedInfraBillingNodes = useMemo(() => infraBillingNodes, [infraBillingNodes])

    const { mutate: deleteInfraBillingNode } = useDeleteInfraBillingNode({
        mutationFns: {
            onSuccess: () => {
                refetchInfraBillingNodes()
                setMultiSelectedRecords([])
            }
        }
    })

    const { mutate: updateNode } = useUpdateInfraBillingNode({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.infraBilling.getInfraBillingNodes.queryKey, data)
                setUpdatingUuids(new Set())
            },
            onError: () => {
                setUpdatingUuids(new Set())
            }
        }
    })

    const handleDeleteInfraBillingNode = () =>
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
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },

            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: () => {
                for (const uuid of multiSelectedRecords) {
                    deleteInfraBillingNode({
                        route: {
                            uuid: uuid.uuid
                        }
                    })
                }
                setMultiSelectedRecords([])
            }
        })

    const handleQuickUpdateNextBillingAt = (uuid: string, currentDate: Date) => {
        setUpdatingUuids((prev) => new Set(prev).add(uuid))
        updateNode({
            variables: {
                uuids: [uuid],
                // @ts-expect-error - TODO: fix ZOD schema
                nextBillingAt: dayjs(currentDate).add(1, 'month').toISOString()
            }
        })
    }

    const handleClickBillingAt = (
        node: GetInfraBillingNodesCommand.Response['response']['billingNodes'][number]
    ) => {
        openModalWithData(MODALS.UPDATE_BILLING_DATE_MODAL, {
            uuids: [node.uuid],
            nextBillingAt: node.nextBillingAt
        })
    }

    const clearMultiSelectedRecords = () => {
        setMultiSelectedRecords([])
    }

    const handleUpdateMultipleNodes = () => {
        openModalWithData(MODALS.UPDATE_BILLING_DATE_MODAL, {
            uuids: multiSelectedRecords.map((node) => node.uuid),
            callback: clearMultiSelectedRecords
        })
    }

    return (
        <DataTableShared.Container shadow="lg">
            <DataTableShared.Title
                actions={
                    <Group gap="xs">
                        <AnimatePresence>
                            {multiSelectedRecords.length > 0 && (
                                <motion.div
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 0 }}
                                    initial={{ opacity: 0, y: 0 }}
                                    transition={{ duration: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
                                >
                                    <Group gap="xs">
                                        <ActionIcon
                                            color="red"
                                            onClick={() => handleDeleteInfraBillingNode()}
                                            size="input-md"
                                            variant="light"
                                        >
                                            <TbTrash size="24px" />
                                        </ActionIcon>

                                        <Tooltip
                                            label={t(
                                                'infra-billing-nodes.widget.update-multiple-nodes'
                                            )}
                                            withArrow
                                        >
                                            <ActionIcon
                                                color="teal"
                                                onClick={handleUpdateMultipleNodes}
                                                size="input-md"
                                                variant="light"
                                            >
                                                <TbCalendar size="24px" />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <ActionIconGroup>
                            <Tooltip label={t('common.refresh')} withArrow>
                                <ActionIcon
                                    loading={infraBillingNodesLoading}
                                    onClick={() => {
                                        refetchInfraBillingNodes()
                                        clearMultiSelectedRecords()
                                    }}
                                    size="input-md"
                                    variant="light"
                                >
                                    <TbRefresh size="24px" />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIconGroup>

                        <ActionIconGroup>
                            <Tooltip label={t('infra-billing-nodes.widget.add-node')} withArrow>
                                <ActionIcon
                                    color="teal"
                                    onClick={() => {
                                        openModalWithData(
                                            MODALS.CREATE_INFRA_BILLING_NODE_MODAL,
                                            undefined
                                        )
                                    }}
                                    size="input-md"
                                    variant="light"
                                >
                                    <TbPlus size="24px" />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIconGroup>
                    </Group>
                }
                icon={<TbServer size={24} />}
                title={t('infra-billing-nodes.widget.infra-billing-nodes')}
            />
            <DataTable
                borderRadius="sm"
                columns={getInfraBillingNodesColumns(
                    handleQuickUpdateNextBillingAt,
                    (uuid) => updatingUuids.has(uuid),
                    t
                )}
                emptyState={
                    <Stack align="center" gap="xs">
                        <Box mb={4} p={4}>
                            <PiEmpty size={36} strokeWidth={1.5} />
                        </Box>
                        <Text c="dimmed" size="sm">
                            {t('infra-billing-nodes.widget.no-nodes-found')}
                        </Text>
                        <Button
                            onClick={() =>
                                openModalWithData(MODALS.CREATE_INFRA_BILLING_NODE_MODAL, undefined)
                            }
                            style={{ pointerEvents: 'all' }}
                            variant="light"
                        >
                            {t('infra-billing-nodes.widget.add-a-node')}
                        </Button>
                    </Stack>
                }
                fetching={infraBillingNodesLoading}
                height={600}
                idAccessor="uuid"
                onCellClick={({ record, column }) => {
                    if (record.provider.loginUrl && column.accessor === 'provider.name') {
                        window.open(record.provider.loginUrl, '_blank', 'noopener,noreferrer')
                    }
                    if (column.accessor === 'nextBillingAt') {
                        handleClickBillingAt(record)
                    }
                }}
                onPageChange={() => {}}
                onSelectedRecordsChange={setMultiSelectedRecords}
                page={1}
                records={memoizedInfraBillingNodes?.billingNodes ?? []}
                recordsPerPage={PAGE_SIZE}
                selectedRecords={multiSelectedRecords}
                totalRecords={memoizedInfraBillingNodes?.totalBillingNodes ?? 0}
                withColumnBorders
                withTableBorder={false}
            />
        </DataTableShared.Container>
    )
}
