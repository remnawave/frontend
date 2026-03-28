import { DataTable, type DataTableSortStatus, useDataTableColumns } from 'mantine-datatable'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { memo, useLayoutEffect, useMemo, useState } from 'react'
import { Box, Button, Group, Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { TbRestore } from 'react-icons/tb'
import { PiEmpty } from 'react-icons/pi'
import get from 'lodash/get'

import { useGetConfigProfiles, useGetNodePlugins, useGetNodes } from '@shared/api/hooks'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { preventBackScrollTables } from '@shared/utils/misc'
import { sToMs } from '@shared/utils/time-utils'
import { LoadingScreen } from '@shared/ui'

import {
    getNodesTableColumns,
    type NodesTableFilters,
    type NodeStatusFilter
} from './use-nodes-table-widget'

type NodeType = GetAllNodesCommand.Response['response'][number]

function getNodeSortValue(node: NodeType, accessor: string): unknown {
    return get(node, accessor)
}

interface IProps {
    nodes: GetAllNodesCommand.Response['response'] | undefined
    selectedRecords: NodeType[]
    setSelectedRecords: (records: NodeType[]) => void
}

const PAGE_SIZE = 50
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 150, 200]
const NODES_CACHE_KEY = 'nodes-datatable-nodes-v2'

export const NodesDataTableWidget = memo((props: IProps) => {
    const { nodes, selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

    const [pageSize, setPageSize] = useState(PAGE_SIZE)
    const [page, setPage] = useState(1)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<NodeType>>({
        columnAccessor: 'viewPosition',
        direction: 'asc'
    })

    const [nameQuery, setNameQuery] = useState('')
    const [debouncedNameQuery] = useDebouncedValue(nameQuery, 200)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedProviders, setSelectedProviders] = useState<string[]>([])
    const [selectedConfigProfiles, setSelectedConfigProfiles] = useState<string[]>([])
    const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])
    const [selectedInbounds, setSelectedInbounds] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<NodeStatusFilter[]>([])

    const { data: configProfiles } = useGetConfigProfiles({})
    const { data: nodePlugins } = useGetNodePlugins()

    const openModalWithData = useModalsStoreOpenWithData()

    useGetNodes({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(5)
        }
    })

    useLayoutEffect(() => {
        document.body.addEventListener('wheel', preventBackScrollTables, {
            passive: false
        })
        return () => {
            document.body.removeEventListener('wheel', preventBackScrollTables)
        }
    }, [])

    const handleViewNode = (nodeUuid: string) => {
        openModalWithData(MODALS.EDIT_NODE_BY_UUID_MODAL, { nodeUuid })
    }

    const { availableTags, availableProviders, availableInbounds } = useMemo(() => {
        if (!nodes) return { availableInbounds: [], availableProviders: [], availableTags: [] }
        const tagsSet = new Set<string>()
        const providersSet = new Set<string>()
        const inboundsSet = new Set<string>()
        for (const node of nodes) {
            node.tags?.forEach((tag) => tagsSet.add(tag))
            if (node.provider?.name) providersSet.add(node.provider.name)
            node.configProfile?.activeInbounds?.forEach((inbound) => inboundsSet.add(inbound.tag))
        }
        return {
            availableInbounds: [...inboundsSet].sort(),
            availableProviders: [...providersSet].sort(),
            availableTags: [...tagsSet].sort()
        }
    }, [nodes])

    const availableConfigProfiles = useMemo(
        () =>
            (configProfiles?.configProfiles ?? []).map((p) => ({
                label: p.name,
                value: p.uuid
            })),
        [configProfiles]
    )

    const availablePlugins = useMemo(
        () =>
            (nodePlugins?.nodePlugins ?? []).map((p) => ({
                label: p.name,
                value: p.uuid
            })),
        [nodePlugins]
    )

    const filters: NodesTableFilters = {
        availableConfigProfiles,
        availableInbounds,
        availablePlugins,
        availableProviders,
        availableTags,
        nameQuery,
        selectedConfigProfiles,
        selectedInbounds,
        selectedPlugins,
        selectedProviders,
        selectedStatuses,
        selectedTags,
        setNameQuery,
        setSelectedConfigProfiles,
        setSelectedInbounds,
        setSelectedPlugins,
        setSelectedProviders,
        setSelectedStatuses,
        setSelectedTags
    }

    const { effectiveColumns, resetColumnsWidth, resetColumnsOrder, resetColumnsToggle } =
        useDataTableColumns({
            key: NODES_CACHE_KEY,
            columns: getNodesTableColumns(
                t,
                configProfiles?.configProfiles ?? [],
                nodePlugins?.nodePlugins ?? [],
                handleViewNode,
                filters
            )
        })

    const filteredAndSortedNodes = useMemo(() => {
        if (!nodes) return []

        const filtered = nodes.filter((node) => {
            if (
                debouncedNameQuery &&
                !node.name.toLowerCase().includes(debouncedNameQuery.toLowerCase())
            ) {
                return false
            }

            if (selectedTags.length > 0 && !selectedTags.some((tag) => node.tags?.includes(tag))) {
                return false
            }

            if (
                selectedProviders.length > 0 &&
                (!node.provider?.name || !selectedProviders.includes(node.provider.name))
            ) {
                return false
            }

            if (
                selectedConfigProfiles.length > 0 &&
                (!node.configProfile.activeConfigProfileUuid ||
                    !selectedConfigProfiles.includes(node.configProfile.activeConfigProfileUuid))
            ) {
                return false
            }

            if (
                selectedPlugins.length > 0 &&
                (!node.activePluginUuid || !selectedPlugins.includes(node.activePluginUuid))
            ) {
                return false
            }

            if (
                selectedInbounds.length > 0 &&
                !selectedInbounds.some((tag) =>
                    node.configProfile?.activeInbounds?.some((inbound) => inbound.tag === tag)
                )
            ) {
                return false
            }

            if (selectedStatuses.length > 0) {
                let nodeStatus: NodeStatusFilter
                if (node.isConnected) nodeStatus = 'connected'
                else if (node.isConnecting) nodeStatus = 'connecting'
                else if (node.isDisabled) nodeStatus = 'disabled'
                else nodeStatus = 'disconnected'

                if (!selectedStatuses.includes(nodeStatus)) return false
            }

            return true
        })

        const isDesc = sortStatus.direction === 'desc'
        const sorted = [...filtered].sort((a, b) => {
            const aVal = getNodeSortValue(a, sortStatus.columnAccessor)
            const bVal = getNodeSortValue(b, sortStatus.columnAccessor)

            if (aVal == null && bVal == null) return 0
            if (aVal == null) return 1
            if (bVal == null) return -1

            let result: number
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                result = aVal.toLowerCase().localeCompare(bVal.toLowerCase())
            } else if (aVal < bVal) {
                result = -1
            } else if (aVal > bVal) {
                result = 1
            } else {
                result = 0
            }

            return isDesc ? -result : result
        })
        return sorted
    }, [
        nodes,
        debouncedNameQuery,
        selectedTags,
        selectedProviders,
        selectedConfigProfiles,
        selectedPlugins,
        selectedInbounds,
        selectedStatuses,
        sortStatus
    ])

    const handleChangePageSize = (newSize: number) => {
        setPageSize(newSize)
        setPage(1)
    }

    if (!nodes || !configProfiles) return <LoadingScreen height="60vh" />

    return (
        <>
            <DataTable
                borderRadius="sm"
                columns={effectiveColumns}
                defaultColumnProps={{
                    noWrap: true,
                    textAlign: 'left',
                    ellipsis: true,
                    draggable: true,
                    toggleable: true,
                    resizable: true
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
                highlightOnHover={true}
                idAccessor="uuid"
                onPageChange={setPage}
                onRecordsPerPageChange={handleChangePageSize}
                onSelectedRecordsChange={setSelectedRecords}
                onSortStatusChange={setSortStatus}
                page={page}
                pinFirstColumn
                pinLastColumn
                records={filteredAndSortedNodes.slice((page - 1) * pageSize, page * pageSize)}
                recordsPerPage={pageSize}
                recordsPerPageOptions={PAGE_SIZE_OPTIONS}
                selectedRecords={selectedRecords}
                sortStatus={sortStatus}
                storeColumnsKey={NODES_CACHE_KEY}
                striped
                totalRecords={filteredAndSortedNodes.length}
                withColumnBorders={false}
                withRowBorders={true}
                withTableBorder={true}
            />
            <Group grow justify="space-between" mt="md">
                <Group justify="right">
                    <Button
                        leftSection={<TbRestore size={16} />}
                        onClick={resetColumnsWidth}
                        size="sm"
                        variant="default"
                    >
                        {t('nodes-datatable.widget.column-width')}
                    </Button>
                    <Button
                        leftSection={<TbRestore size={16} />}
                        onClick={resetColumnsOrder}
                        size="sm"
                        variant="default"
                    >
                        {t('nodes-datatable.widget.column-order')}
                    </Button>
                    <Button
                        leftSection={<TbRestore size={16} />}
                        onClick={resetColumnsToggle}
                        size="sm"
                        variant="default"
                    >
                        {t('nodes-datatable.widget.column-toggle')}
                    </Button>
                </Group>
            </Group>
        </>
    )
})
