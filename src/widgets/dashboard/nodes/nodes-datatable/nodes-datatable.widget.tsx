import { DataTable, type DataTableSortStatus, useDataTableColumns } from '@kastov/mantine-datatable'
import { Box, Button, Stack, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'

import { showModal } from '@shared/_modals/show-modal'
import {
    useGetConfigProfiles,
    useGetNodeIntegrations,
    useGetNodePlugins,
    useGetNodes
} from '@shared/api/hooks'
import { usePreventTableBackScroll } from '@shared/hooks'
import { DataTableControls, LoadingScreen, sortRecords } from '@shared/ui'
import { sToMs } from '@shared/utils/time-utils'

import {
    getNodesTableColumns,
    type NodesTableFilters,
    type NodeStatusFilter
} from './use-nodes-table-widget'

type NodeType = GetNodesCommand.Response['response'][number]

interface IProps {
    nodes: GetNodesCommand.Response['response'] | undefined
    selectedRecords: NodeType[]
    setSelectedRecords: (records: NodeType[]) => void
}

const NODES_CACHE_KEY = 'nodes-datatable-nodes-v8'
const DEFAULT_SORT_STATUS: DataTableSortStatus<NodeType> = {
    columnAccessor: 'viewPosition',
    direction: 'asc'
}

export const NodesDataTableWidget = memo((props: IProps) => {
    const { nodes, selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<NodeType>>(DEFAULT_SORT_STATUS)

    const [nameQuery, setNameQuery] = useState('')
    const [debouncedNameQuery] = useDebouncedValue(nameQuery, 200)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedProviders, setSelectedProviders] = useState<string[]>([])
    const [selectedConfigProfiles, setSelectedConfigProfiles] = useState<string[]>([])
    const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])
    const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
    const [selectedInbounds, setSelectedInbounds] = useState<string[]>([])
    const [selectedStatuses, setSelectedStatuses] = useState<NodeStatusFilter[]>([])

    const { data: configProfiles } = useGetConfigProfiles({})
    const { data: nodePlugins } = useGetNodePlugins()
    const { data: nodeIntegrations } = useGetNodeIntegrations()

    useGetNodes({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(5)
        }
    })

    usePreventTableBackScroll()

    const handleViewNode = (nodeUuid: string) => {
        showModal('nodes_editNodeModal', { nodeUuid })
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

    const availableIntegrations = useMemo(
        () =>
            (nodeIntegrations?.nodeIntegrations ?? []).map((integration) => ({
                label: integration.name,
                value: integration.uuid
            })),
        [nodeIntegrations]
    )

    const filters: NodesTableFilters = {
        availableConfigProfiles,
        availableInbounds,
        availableIntegrations,
        availablePlugins,
        availableProviders,
        availableTags,
        nameQuery,
        selectedConfigProfiles,
        selectedInbounds,
        selectedIntegrations,
        selectedPlugins,
        selectedProviders,
        selectedStatuses,
        selectedTags,
        setNameQuery,
        setSelectedConfigProfiles,
        setSelectedInbounds,
        setSelectedIntegrations,
        setSelectedPlugins,
        setSelectedProviders,
        setSelectedStatuses,
        setSelectedTags
    }

    const tableColumns = getNodesTableColumns(
        t,
        configProfiles?.configProfiles ?? [],
        nodePlugins?.nodePlugins ?? [],
        nodeIntegrations?.nodeIntegrations ?? [],
        handleViewNode,
        filters
    ).map((column) => ({ draggable: true, resizable: true, toggleable: true, ...column }))

    const {
        effectiveColumns,
        resetColumnsWidth,
        resetColumnsOrder,
        resetColumnsToggle,
        columnsToggle,
        setColumnsToggle
    } = useDataTableColumns({ key: NODES_CACHE_KEY, columns: tableColumns })

    const columnLabels = Object.fromEntries(
        tableColumns
            .filter((column) => typeof column.title === 'string' && column.title !== '')
            .map((column) => [column.accessor, column.title])
    ) as Record<string, string>

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
                selectedIntegrations.length > 0 &&
                !selectedIntegrations.some((uuid) => node.integrationUuids?.includes(uuid))
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

        return sortRecords(filtered, sortStatus)
    }, [
        nodes,
        debouncedNameQuery,
        selectedTags,
        selectedProviders,
        selectedConfigProfiles,
        selectedPlugins,
        selectedIntegrations,
        selectedInbounds,
        selectedStatuses,
        sortStatus
    ])

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
                height="55vh"
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
                onSelectedRecordsChange={setSelectedRecords}
                onSortStatusChange={setSortStatus}
                pinFirstColumn
                pinLastColumn
                records={filteredAndSortedNodes}
                selectedRecords={selectedRecords}
                sortStatus={sortStatus}
                storeColumnsKey={NODES_CACHE_KEY}
                striped
                withColumnBorders
                withRowBorders
                withTableBorder
                columnResizeMode="expand"
                rowVirtualization={{
                    fixedLayout: false,
                    overscan: 25
                }}
            />
            <DataTableControls
                columnsToggle={columnsToggle}
                labelByAccessor={columnLabels}
                onResetColumnsOrder={resetColumnsOrder}
                onResetColumnsToggle={resetColumnsToggle}
                onResetColumnsWidth={resetColumnsWidth}
                onResetSort={() => setSortStatus(DEFAULT_SORT_STATUS)}
                setColumnsToggle={setColumnsToggle}
                sortResetDisabled={
                    sortStatus.columnAccessor === DEFAULT_SORT_STATUS.columnAccessor &&
                    sortStatus.direction === DEFAULT_SORT_STATUS.direction
                }
            />
        </>
    )
})
