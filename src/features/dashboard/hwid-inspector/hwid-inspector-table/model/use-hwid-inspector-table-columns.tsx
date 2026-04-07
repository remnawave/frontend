/* eslint-disable camelcase */
import { GetAllHwidDevicesCommand } from '@remnawave/backend-contract'
import { MRT_ColumnDef } from 'mantine-react-table'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import dayjs from 'dayjs'

export const useHwidInspectorTableColumns = () => {
    const { t } = useTranslation()

    return useMemo<
        MRT_ColumnDef<GetAllHwidDevicesCommand.Response['response']['devices'][number]>[]
    >(
        () => [
            {
                accessorKey: 'userId',
                header: 'User ID',
                accessorFn: (originalRow) => originalRow.userId,
                size: 130
            },
            {
                accessorKey: 'requestIp',
                header: t('use-srh-inspector-table-columns.request-ip'),
                accessorFn: (originalRow) => originalRow.requestIp || '–'
            },
            {
                accessorKey: 'hwid',
                header: 'HWID',
                accessorFn: (originalRow) => originalRow.hwid,
                size: 200
            },
            {
                accessorKey: 'platform',
                header: t('use-hwid-inspector-table-columns.platform'),
                accessorFn: (originalRow) => originalRow.platform || '–'
            },
            {
                accessorKey: 'osVersion',
                header: t('use-hwid-inspector-table-columns.os-version'),
                accessorFn: (originalRow) => originalRow.osVersion || '–',
                size: 100
            },
            {
                accessorKey: 'deviceModel',
                header: t('use-hwid-inspector-table-columns.device-model'),
                accessorFn: (originalRow) => originalRow.deviceModel || '–'
            },
            {
                accessorKey: 'userAgent',
                header: t('use-hwid-inspector-table-columns.user-agent'),
                accessorFn: (originalRow) => originalRow.userAgent || '–',
                size: 500
            },

            {
                accessorKey: 'createdAt',
                header: t('use-hwid-inspector-table-columns.created-at'),
                accessorFn: (originalRow) =>
                    dayjs(originalRow.createdAt).format('DD/MM/YYYY, HH:mm'),
                minSize: 250,
                enableColumnFilter: false,
                enableColumnFilterModes: false
            },
            {
                accessorKey: 'updatedAt',
                header: t('use-hwid-inspector-table-columns.updated-at'),
                accessorFn: (originalRow) =>
                    dayjs(originalRow.updatedAt).format('DD/MM/YYYY, HH:mm'),
                minSize: 250,
                enableColumnFilter: false,
                enableColumnFilterModes: false
            }
        ],
        [t]
    )
}
