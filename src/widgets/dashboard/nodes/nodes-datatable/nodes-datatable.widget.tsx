import { DataTable, useDataTableColumns } from 'mantine-datatable'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { Box, Button, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { memo, useState } from 'react'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { useGetConfigProfiles, useGetNodes } from '@shared/api/hooks'
import { sToMs } from '@shared/utils/time-utils'
import { LoadingScreen } from '@shared/ui'

import { getNodesTableColumns } from './use-nodes-table-widget'

interface IProps {
    nodes: GetAllNodesCommand.Response['response'] | undefined
    selectedRecords: GetAllNodesCommand.Response['response'][number][]
    setSelectedRecords: (records: GetAllNodesCommand.Response['response'][number][]) => void
}

const PAGE_SIZE = 20
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
const NODES_CACHE_KEY = 'nodes-datatable-nodes-v1'

export const NodesDataTableWidget = memo((props: IProps) => {
    const { nodes, selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

    const [pageSize, setPageSize] = useState(PAGE_SIZE)
    const [page, setPage] = useState(1)

    const { data: configProfiles } = useGetConfigProfiles({})

    const openModalWithData = useModalsStoreOpenWithData()

    useGetNodes({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(5)
        }
    })

    const handleViewNode = (nodeUuid: string) => {
        openModalWithData(MODALS.EDIT_NODE_BY_UUID_MODAL, { nodeUuid })
    }

    const { effectiveColumns } = useDataTableColumns({
        key: NODES_CACHE_KEY,
        columns: getNodesTableColumns(t, configProfiles?.configProfiles ?? [], handleViewNode)
    })

    const handleChangePageSize = (pageSize: number) => {
        setPageSize(pageSize)
        setPage(1)
    }

    if (!nodes || !configProfiles) return <LoadingScreen height="60vh" />

    return (
        <DataTable
            borderRadius="sm"
            columns={effectiveColumns}
            defaultColumnProps={{
                noWrap: true,
                textAlign: 'left',
                ellipsis: true,
                draggable: true
            }}
            emptyState={
                <Stack align="center" gap="xs">
                    <Box mb={4} p={4}>
                        <PiEmpty size={36} strokeWidth={1.5} />
                    </Box>
                    <Text c="dimmed" size="sm">
                        {t('infra-billing-nodes.widget.no-nodes-found')}
                    </Text>
                    <Button style={{ pointerEvents: 'all' }} variant="light">
                        {t('infra-billing-nodes.widget.add-a-node')}
                    </Button>
                </Stack>
            }
            fetching={false}
            idAccessor="uuid"
            onPageChange={setPage}
            onRecordsPerPageChange={handleChangePageSize}
            onSelectedRecordsChange={setSelectedRecords}
            page={page}
            pinFirstColumn
            records={nodes.slice((page - 1) * pageSize, page * pageSize)}
            recordsPerPage={pageSize}
            recordsPerPageOptions={PAGE_SIZE_OPTIONS}
            selectedRecords={selectedRecords}
            selectionColumnStyle={{
                backgroundColor: 'var(--mantine-color-dark-7)'
            }}
            storeColumnsKey={NODES_CACHE_KEY}
            totalRecords={nodes.length}
            withColumnBorders={false}
            withRowBorders={true}
            withTableBorder={true}
        />
    )
})
