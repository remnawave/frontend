import { DataTable, type DataTableSortStatus, useDataTableColumns } from '@kastov/mantine-datatable'
import { ActionIcon, Anchor, Group, Text, ThemeIcon } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { GetUserHwidDevicesCommand } from '@remnawave/backend-contract'
import get from 'lodash/get'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiDeviceMobile, PiLinuxLogo } from 'react-icons/pi'
import {
    TbBrandAndroid,
    TbBrandApple,
    TbBrandFinder,
    TbBrandWindows,
    TbTrash
} from 'react-icons/tb'

import {
    CopyableCell,
    DataTableControls,
    EllipsisCell,
    sortRecords,
    TextSearchFilter
} from '@shared/ui'
import { formatTimeUtil } from '@shared/utils/time-utils'

type TDevice = GetUserHwidDevicesCommand.Response['response']['devices'][number]

interface IProps {
    devices: TDevice[] | undefined
    isLoading: boolean
    onDelete: (hwid: string) => void
}

const CACHE_KEY = 'hwid-devices-datatable-v2'
const DEFAULT_SORT_STATUS: DataTableSortStatus<TDevice> = {
    columnAccessor: 'createdAt',
    direction: 'desc'
}

const TEXT_ACCESSORS = ['platform', 'hwid', 'requestIp', 'deviceModel', 'userAgent'] as const

const resolvePlatformIcon = (platform: null | string) => {
    switch (platform?.toLowerCase()) {
        case 'android':
            return <TbBrandAndroid size={24} />
        case 'ios':
            return <TbBrandApple size={24} />
        case 'linux':
            return <PiLinuxLogo size={24} />
        case 'macos':
            return <TbBrandFinder size={24} />
        case 'windows':
            return <TbBrandWindows size={24} />
        default:
            return <PiDeviceMobile size={24} />
    }
}

export const UserHwidDevicesTable = (props: IProps) => {
    const { devices, onDelete, isLoading } = props
    const { t, i18n } = useTranslation()

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TDevice>>(DEFAULT_SORT_STATUS)
    const [textQueries, setTextQueries] = useState<Record<string, string>>({})
    const [debouncedTextQueries] = useDebouncedValue(textQueries, 200)

    const setTextQuery = useCallback((key: string, value: string) => {
        setTextQueries((prev) => ({ ...prev, [key]: value }))
    }, [])

    const textColumn = (
        accessor: string,
        title: string,
        render?: (device: TDevice) => ReactNode,
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
            ((device: TDevice) => (
                <EllipsisCell>{(get(device, accessor) as string) || '–'}</EllipsisCell>
            ))
    })

    const columns = [
        textColumn(
            'platform',
            'Platform',
            (device) => (
                <Group gap="xs" wrap="nowrap">
                    <ThemeIcon color="indigo" size="lg" variant="soft">
                        {resolvePlatformIcon(device.platform)}
                    </ThemeIcon>
                    <Text size="sm">{device.platform || 'Unknown'}</Text>
                </Group>
            ),
            180
        ),
        textColumn('hwid', 'HWID', (device) => <CopyableCell value={device.hwid} />, 120),
        textColumn(
            'requestIp',
            t('common.ip-address'),
            (device) =>
                device.requestIp ? (
                    <Anchor
                        c="cyan"
                        ff="monospace"
                        href={`https://ipinfo.io/${device.requestIp}`}
                        rel="noopener noreferrer"
                        size="sm"
                        target="_blank"
                        underline="never"
                    >
                        {device.requestIp}
                    </Anchor>
                ) : (
                    '–'
                ),
            200
        ),
        textColumn(
            'deviceModel',
            t('get-hwid-user-devices.feature.model'),
            (device) => {
                const model = device.deviceModel || '–'
                return (
                    <EllipsisCell>
                        {device.osVersion ? `${model} (${device.osVersion})` : model}
                    </EllipsisCell>
                )
            },
            220
        ),
        textColumn(
            'userAgent',
            t('get-hwid-user-devices.feature.user-agent'),
            (device) => <CopyableCell value={device.userAgent || '–'} />,
            200
        ),
        {
            accessor: 'createdAt',
            title: t('get-hwid-user-devices.feature.added'),
            ellipsis: false,
            sortable: true,
            toggleable: true,
            width: 220,
            render: (device: TDevice) => (
                <Text ff="monospace" size="sm">
                    {formatTimeUtil({
                        time: device.createdAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    })}
                </Text>
            )
        },
        {
            accessor: 'updatedAt',
            title: 'Updated',
            sortable: true,
            ellipsis: false,
            toggleable: true,
            width: 220,
            render: (device: TDevice) => (
                <Text ff="monospace" size="sm">
                    {formatTimeUtil({
                        time: device.updatedAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    })}
                </Text>
            )
        },
        {
            accessor: 'actions',
            title: '',
            textAlign: 'center' as const,
            width: 60,
            draggable: false,
            resizable: true,
            toggleable: false,
            sortable: false,
            render: (device: TDevice) => (
                <ActionIcon
                    aria-label={t('get-hwid-user-devices.feature.delete-device')}
                    color="red"
                    onClick={() => onDelete(device.hwid)}
                    size="md"
                    variant="soft"
                >
                    <TbTrash size={16} />
                </ActionIcon>
            )
        }
    ]

    const {
        effectiveColumns,
        resetColumnsWidth,
        resetColumnsOrder,
        resetColumnsToggle,
        columnsToggle,
        setColumnsToggle
    } = useDataTableColumns<TDevice>({ key: CACHE_KEY, columns })

    const columnLabels = useMemo<Record<string, string>>(
        () => ({
            platform: 'Platform',
            hwid: 'HWID',
            requestIp: t('common.ip-address'),
            deviceModel: t('get-hwid-user-devices.feature.model'),
            userAgent: t('get-hwid-user-devices.feature.user-agent'),
            createdAt: t('get-hwid-user-devices.feature.added'),
            updatedAt: 'Updated'
        }),
        [t]
    )

    const records = useMemo(() => {
        const filtered = (devices ?? []).filter((device) =>
            TEXT_ACCESSORS.every((accessor) => {
                const query = debouncedTextQueries[accessor]
                if (!query) return true
                const value =
                    accessor === 'deviceModel'
                        ? `${device.deviceModel ?? ''} ${device.osVersion ?? ''}`
                        : get(device, accessor)
                return value != null && String(value).toLowerCase().includes(query.toLowerCase())
            })
        )

        return sortRecords(filtered, sortStatus)
    }, [devices, debouncedTextQueries, sortStatus])

    return (
        <>
            <DataTable<TDevice>
                borderRadius="sm"
                pinFirstColumn
                columns={effectiveColumns}
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
                idAccessor="hwid"
                onSortStatusChange={setSortStatus}
                records={records}
                striped
                sortStatus={sortStatus}
                storeColumnsKey={CACHE_KEY}
                withColumnBorders
                withRowBorders
                withTableBorder
                columnResizeMode="expand"
                rowVirtualization={{
                    fixedLayout: true
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
}
