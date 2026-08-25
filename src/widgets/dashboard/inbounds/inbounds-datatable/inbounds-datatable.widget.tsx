import { DataTable, type DataTableSortStatus, useDataTableColumns } from '@kastov/mantine-datatable'
import { Box, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import {
    GetAllInboundsCommand,
    GetConfigProfilesCommand,
    GetInternalSquadsCommand
} from '@remnawave/backend-contract'
import { IInboundNodeAggregate } from '@widgets/dashboard/inbounds/inbound-status-tile/get-inbound-node-status.util'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { TbTag } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { usePreventTableBackScroll } from '@shared/hooks'
import { DataTableControls, sortRecords } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import {
    getInboundsTableColumns,
    type InboundRow,
    type InboundsTableFilters
} from './use-inbounds-table-widget'

type Inbound = GetAllInboundsCommand.Response['response']['inbounds'][number]

const INBOUNDS_CACHE_KEY = 'inbounds-datatable-v1'
const DEFAULT_SORT_STATUS: DataTableSortStatus<InboundRow> = {
    columnAccessor: 'tag',
    direction: 'asc'
}

const openRawInboundModal = (inbound: InboundRow) => {
    modals.open({
        children: (
            <Box>
                <JsonEditor
                    collapse={3}
                    data={inbound.rawInbound as object}
                    indent={4}
                    maxWidth="100%"
                    rootName=""
                    theme={githubDarkTheme}
                    viewOnly
                />
            </Box>
        ),
        size: 'xl',
        title: (
            <BaseOverlayHeader
                iconColor="teal"
                IconComponent={TbTag}
                iconVariant="soft"
                title={inbound.tag}
                titleOrder={5}
            />
        )
    })
}

interface IProps {
    inbounds: Inbound[] | undefined
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads'] | undefined
    nodeAggregateByInboundUuid: Map<string, IInboundNodeAggregate>
}

export const InboundsDataTableWidget = memo((props: IProps) => {
    const {
        inbounds,
        configProfiles: configProfilesProp,
        internalSquads: internalSquadsProp,
        nodeAggregateByInboundUuid
    } = props
    const { t } = useTranslation()

    const [sortStatus, setSortStatus] =
        useState<DataTableSortStatus<InboundRow>>(DEFAULT_SORT_STATUS)
    const [selectedConfigProfiles, setSelectedConfigProfiles] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    usePreventTableBackScroll()

    const rows: InboundRow[] = useMemo(
        () =>
            (inbounds ?? []).map((inbound) => ({
                ...inbound,
                onlineUsersCount: inbound.onlineByNode.reduce((acc, node) => acc + node.count, 0)
            })),
        [inbounds]
    )

    const handleRowClick = (inbound: InboundRow) => {
        showModal('configProfiles_inboundUsageDrawer', { inboundUuid: inbound.uuid })
    }

    const configProfiles = configProfilesProp ?? []
    const internalSquads = internalSquadsProp ?? []

    const availableConfigProfiles = useMemo(
        () => configProfiles.map((profile) => ({ label: profile.name, value: profile.uuid })),
        [configProfiles]
    )

    const availableTypes = useMemo(() => {
        if (!inbounds) return []
        return [...new Set(inbounds.map((inbound) => inbound.type))].sort()
    }, [inbounds])

    const filters: InboundsTableFilters = {
        availableConfigProfiles,
        availableTypes,
        selectedConfigProfiles,
        selectedTypes,
        setSelectedConfigProfiles,
        setSelectedTypes
    }

    const tableColumns = getInboundsTableColumns(
        t,
        configProfiles,
        internalSquads,
        nodeAggregateByInboundUuid,
        openRawInboundModal,
        filters
    ).map((column) => ({ draggable: true, resizable: true, toggleable: true, ...column }))

    const {
        effectiveColumns,
        resetColumnsWidth,
        resetColumnsOrder,
        resetColumnsToggle,
        columnsToggle,
        setColumnsToggle
    } = useDataTableColumns({ key: INBOUNDS_CACHE_KEY, columns: tableColumns })

    const columnLabels = Object.fromEntries(
        tableColumns
            .filter((column) => typeof column.title === 'string' && column.title !== '')
            .map((column) => [column.accessor, column.title])
    ) as Record<string, string>

    const filteredAndSortedInbounds = useMemo(() => {
        const filtered = rows.filter((inbound) => {
            if (
                selectedConfigProfiles.length > 0 &&
                !selectedConfigProfiles.includes(inbound.profileUuid)
            ) {
                return false
            }

            if (selectedTypes.length > 0 && !selectedTypes.includes(inbound.type)) {
                return false
            }

            return true
        })

        return sortRecords(filtered, sortStatus)
    }, [rows, selectedConfigProfiles, selectedTypes, sortStatus])

    if (!inbounds) return null

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
                            {t('inbounds-datatable.widget.no-inbounds-found')}
                        </Text>
                    </Stack>
                }
                fetching={false}
                highlightOnHover={true}
                idAccessor="uuid"
                onRowClick={({ record }) => handleRowClick(record)}
                onSortStatusChange={setSortStatus}
                pinLastColumn
                records={filteredAndSortedInbounds}
                rowStyle={() => ({ cursor: 'pointer' })}
                sortStatus={sortStatus}
                storeColumnsKey={INBOUNDS_CACHE_KEY}
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
