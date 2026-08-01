import { DataTable, type DataTableSortStatus, useDataTableColumns } from '@kastov/mantine-datatable'
import { Anchor, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { GetUserSubscriptionRequestHistoryCommand } from '@remnawave/backend-contract'
import get from 'lodash/get'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    CopyableCell,
    DataTableControls,
    EllipsisCell,
    sortRecords,
    TextSearchFilter
} from '@shared/ui'
import { formatTimeUtil } from '@shared/utils/time-utils'

type TRecord = GetUserSubscriptionRequestHistoryCommand.Response['response']['records'][number]

interface IProps {
    isLoading: boolean
    records: TRecord[] | undefined
}

const CACHE_KEY = 'subscription-requests-datatable-v1'
const DEFAULT_SORT_STATUS: DataTableSortStatus<TRecord> = {
    columnAccessor: 'requestAt',
    direction: 'desc'
}

const TEXT_ACCESSORS = ['id', 'requestIp', 'userAgent', 'srrRuleName', 'srrResponseType'] as const

export const UserSubscriptionRequestsTable = (props: IProps) => {
    const { records: data, isLoading } = props
    const { t, i18n } = useTranslation()

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TRecord>>(DEFAULT_SORT_STATUS)
    const [textQueries, setTextQueries] = useState<Record<string, string>>({})
    const [debouncedTextQueries] = useDebouncedValue(textQueries, 200)

    const setTextQuery = useCallback((key: string, value: string) => {
        setTextQueries((prev) => ({ ...prev, [key]: value }))
    }, [])

    const textColumn = (
        accessor: string,
        title: string,
        render?: (record: TRecord) => ReactNode,
        width?: number
    ) => ({
        accessor,
        title,
        sortable: true,
        toggleable: true,
        ellipsis: true,
        width,
        filter: (
            <TextSearchFilter
                label={title}
                onChange={(value) => setTextQuery(accessor, value)}
                value={textQueries[accessor] ?? ''}
            />
        ),
        filtering: (textQueries[accessor] ?? '') !== '',
        render:
            render ??
            ((record: TRecord) => (
                <EllipsisCell>{(get(record, accessor) as string) || '–'}</EllipsisCell>
            ))
    })

    const columns = [
        textColumn('id', 'ID', undefined, 80),
        textColumn(
            'requestIp',
            t('get-user-subscription-request-history.feature.ip-address'),
            (record) =>
                record.requestIp ? (
                    <Anchor
                        c="cyan"
                        ff="monospace"
                        href={`https://ipinfo.io/${record.requestIp}`}
                        rel="noopener noreferrer"
                        size="sm"
                        target="_blank"
                        underline="never"
                    >
                        {record.requestIp}
                    </Anchor>
                ) : (
                    '–'
                ),
            200
        ),
        textColumn(
            'userAgent',
            t('get-user-subscription-request-history.feature.user-agent'),
            (record) => <CopyableCell value={record.userAgent || '–'} />,
            400
        ),
        {
            accessor: 'requestAt',
            title: t('get-user-subscription-request-history.feature.request-at'),
            ellipsis: false,
            sortable: true,
            toggleable: true,
            width: 250,
            render: (record: TRecord) => (
                <Text ff="monospace" size="sm">
                    {formatTimeUtil({
                        time: record.requestAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    })}
                </Text>
            )
        },
        textColumn(
            'srrRuleName',
            t('use-srh-inspector-table-columns.rule-name'),
            (record) => <CopyableCell value={record.srrRuleName || '–'} />,
            200
        ),
        textColumn(
            'srrResponseType',
            t('use-srh-inspector-table-columns.response-type'),
            (record) => <CopyableCell value={record.srrResponseType} />,
            200
        )
    ]

    const {
        effectiveColumns,
        resetColumnsWidth,
        resetColumnsOrder,
        resetColumnsToggle,
        columnsToggle,
        setColumnsToggle
    } = useDataTableColumns<TRecord>({ key: CACHE_KEY, columns })

    const columnLabels = useMemo<Record<string, string>>(
        () => ({
            id: 'ID',
            requestIp: t('get-user-subscription-request-history.feature.ip-address'),
            userAgent: t('get-user-subscription-request-history.feature.user-agent'),
            requestAt: t('get-user-subscription-request-history.feature.request-at'),
            srrRuleName: t('use-srh-inspector-table-columns.rule-name'),
            srrResponseType: t('use-srh-inspector-table-columns.response-type')
        }),
        [t]
    )

    const records = useMemo(() => {
        const filtered = (data ?? []).filter((record) =>
            TEXT_ACCESSORS.every((accessor) => {
                const query = debouncedTextQueries[accessor]
                if (!query) return true
                const value = get(record, accessor)
                return value != null && String(value).toLowerCase().includes(query.toLowerCase())
            })
        )

        return sortRecords(filtered, sortStatus)
    }, [data, debouncedTextQueries, sortStatus])

    return (
        <>
            <DataTable<TRecord>
                borderRadius="sm"
                columns={effectiveColumns}
                columnResizeMode="expand"
                defaultColumnProps={{
                    noWrap: true,
                    textAlign: 'left',
                    draggable: true,
                    toggleable: true,
                    resizable: true
                }}
                fetching={isLoading}
                height={500}
                highlightOnHover
                idAccessor="id"
                onSortStatusChange={setSortStatus}
                pinFirstColumn
                records={records}
                sortStatus={sortStatus}
                storeColumnsKey={CACHE_KEY}
                striped
                withColumnBorders
                withRowBorders
                withTableBorder
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
}
