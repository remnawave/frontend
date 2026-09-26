import { DataTable, type DataTableSortStatus, useDataTableColumns } from '@kastov/mantine-datatable'
import { useDebouncedValue } from '@mantine/hooks'
import {
    GetHostsCommand,
    GetHostsTagsCommand,
    GetConfigProfilesCommand
} from '@remnawave/backend-contract'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { showModal } from '@shared/_modals/show-modal'
import {
    useGetHosts,
    useGetInternalSquads,
    useGetNodes,
    useGetSubscriptionTemplates
} from '@shared/api/hooks'
import { usePreventTableBackScroll } from '@shared/hooks'
import { DataTableControls, LoadingScreen, sortRecords } from '@shared/ui'
import { sToMs } from '@shared/utils/time-utils'

import {
    type BooleanFilterValue,
    getHostColumnLabels,
    getHostsTableColumns,
    HOST_BOOLEAN_FIELDS,
    HOST_SELECT_FIELDS,
    HOST_TEXT_FIELDS,
    type HostsTableFilters,
    type HostStatusFilter,
    type HostType
} from './use-hosts-table-widget'

interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    hosts: GetHostsCommand.Response['response'] | undefined
    hostTags: GetHostsTagsCommand.Response['response']['tags'] | undefined
    selectedHosts: string[]
    setSelectedHosts: React.Dispatch<React.SetStateAction<string[]>>
    state: GetHostsCommand.Response['response']
}

const HOSTS_CACHE_KEY = 'hosts-datatable-hosts-v5'
const DEFAULT_SORT_STATUS: DataTableSortStatus<HostType> = {
    columnAccessor: 'viewPosition',
    direction: 'asc'
}

export const HostsDataTableWidget = memo((props: IProps) => {
    const { configProfiles, hosts, selectedHosts, setSelectedHosts, state } = props
    const { t } = useTranslation()

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<HostType>>(DEFAULT_SORT_STATUS)

    const [textQueries, setTextQueries] = useState<Record<string, string>>({})
    const [debouncedTextQueries] = useDebouncedValue(textQueries, 200)
    const [booleanFilters, setBooleanFilters] = useState<Record<string, BooleanFilterValue>>({})
    const [selectFilters, setSelectFilters] = useState<Record<string, string[]>>({})
    const [selectedStatuses, setSelectedStatuses] = useState<HostStatusFilter[]>([])

    const setTextQuery = useCallback((key: string, value: string) => {
        setTextQueries((prev) => ({ ...prev, [key]: value }))
    }, [])
    const setBooleanFilter = useCallback((key: string, value: BooleanFilterValue) => {
        setBooleanFilters((prev) => ({ ...prev, [key]: value }))
    }, [])
    const setSelectFilter = useCallback((key: string, value: string[]) => {
        setSelectFilters((prev) => ({ ...prev, [key]: value }))
    }, [])

    const { data: nodes } = useGetNodes()
    const { data: internalSquads } = useGetInternalSquads()
    const { data: subscriptionTemplates } = useGetSubscriptionTemplates()

    useGetHosts({
        rQueryParams: {
            enabled: true,
            refetchInterval: sToMs(60)
        }
    })

    usePreventTableBackScroll()

    const handleViewHost = (hostUuid: string) => {
        if (!hosts) return
        showModal('hosts_editHostDrawer', {
            hostUuid: hosts.find((host) => host.uuid === hostUuid)!.uuid
        })
    }

    const selectedRecords = useMemo(() => {
        const selectedSet = new Set(selectedHosts)
        return (hosts ?? []).filter((host) => selectedSet.has(host.uuid))
    }, [hosts, selectedHosts])

    const handleSelectedRecordsChange = (records: HostType[]) => {
        setSelectedHosts(records.map((record) => record.uuid))
    }

    const context = useMemo(() => {
        const configProfileNameByUuid = new Map<string, string>()
        const inboundTagByUuid = new Map<string, string>()
        const nodeNameByUuid = new Map<string, string>()
        const internalSquadNameByUuid = new Map<string, string>()
        const xrayTemplateNameByUuid = new Map<string, string>()
        for (const profile of configProfiles ?? []) {
            configProfileNameByUuid.set(profile.uuid, profile.name)
            for (const inbound of profile.inbounds ?? []) {
                inboundTagByUuid.set(inbound.uuid, inbound.tag)
            }
        }
        for (const node of nodes ?? []) {
            nodeNameByUuid.set(node.uuid, node.name)
        }
        for (const squad of internalSquads?.internalSquads ?? []) {
            internalSquadNameByUuid.set(squad.uuid, squad.name)
        }
        for (const template of subscriptionTemplates?.templates ?? []) {
            xrayTemplateNameByUuid.set(template.uuid, template.name)
        }
        return {
            configProfileNameByUuid,
            inboundTagByUuid,
            internalSquadNameByUuid,
            nodeNameByUuid,
            xrayTemplateNameByUuid
        }
    }, [configProfiles, nodes, internalSquads, subscriptionTemplates])

    const selectOptions = useMemo(() => {
        const result: Record<string, { label: string; value: string }[]> = {}
        for (const cfg of HOST_SELECT_FIELDS) {
            const values = new Set<string>()
            for (const host of hosts ?? []) {
                for (const value of cfg.getValues(host)) values.add(value)
            }
            result[cfg.key] = [...values]
                .map((value) => ({
                    label: cfg.valueLabel ? cfg.valueLabel(value, context) : value,
                    value
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
        }
        return result
    }, [hosts, context])

    const filters: HostsTableFilters = {
        booleanFilters,
        context,
        selectedStatuses,
        selectFilters,
        selectOptions,
        setBooleanFilter,
        setSelectedStatuses,
        setSelectFilter,
        setTextQuery,
        textQueries
    }

    const {
        effectiveColumns,
        resetColumnsWidth,
        resetColumnsOrder,
        resetColumnsToggle,
        columnsToggle,
        setColumnsToggle
    } = useDataTableColumns({
        key: HOSTS_CACHE_KEY,
        columns: getHostsTableColumns(t, handleViewHost, filters)
    })

    const columnLabels = useMemo(() => getHostColumnLabels(t), [t])

    const filteredAndSortedHosts = useMemo(() => {
        const filtered = (state ?? []).filter((host) => {
            const failsTextFilter = HOST_TEXT_FIELDS.some((cfg) => {
                const query = debouncedTextQueries[cfg.key]
                if (!query) return false
                const value = cfg.getValue(host)
                return value == null || !String(value).toLowerCase().includes(query.toLowerCase())
            })
            if (failsTextFilter) return false

            const failsBooleanFilter = HOST_BOOLEAN_FIELDS.some((cfg) => {
                const filter = booleanFilters[cfg.key]
                if (!filter || filter === 'all') return false
                return cfg.getValue(host) !== (filter === 'yes')
            })
            if (failsBooleanFilter) return false

            const failsSelectFilter = HOST_SELECT_FIELDS.some((cfg) => {
                const selected = selectFilters[cfg.key]
                if (!selected || selected.length === 0) return false
                const values = cfg.getValues(host)
                return !selected.some((value) => values.includes(value))
            })
            if (failsSelectFilter) return false

            if (selectedStatuses.length > 0) {
                const matchesStatus = selectedStatuses.some((status) => {
                    if (status === 'disabled') return host.isDisabled
                    if (status === 'enabled') return !host.isDisabled
                    if (status === 'hidden') return host.isHidden
                    return false
                })

                if (!matchesStatus) {
                    return false
                }
            }

            return true
        })

        if (sortStatus.columnAccessor === 'viewPosition') {
            return sortStatus.direction === 'desc' ? [...filtered].reverse() : filtered
        }

        return sortRecords(filtered, sortStatus)
    }, [state, debouncedTextQueries, booleanFilters, selectFilters, selectedStatuses, sortStatus])

    if (!hosts || !configProfiles) {
        return <LoadingScreen height="60vh" />
    }

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
                height="65vh"
                fetching={false}
                highlightOnHover={true}
                idAccessor="uuid"
                onSelectedRecordsChange={handleSelectedRecordsChange}
                onSortStatusChange={setSortStatus}
                pinFirstColumn
                pinLastColumn
                records={filteredAndSortedHosts}
                selectedRecords={selectedRecords}
                sortStatus={sortStatus}
                storeColumnsKey={HOSTS_CACHE_KEY}
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
