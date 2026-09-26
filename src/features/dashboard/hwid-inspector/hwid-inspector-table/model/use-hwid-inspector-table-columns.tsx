import { MRT_ColumnDef } from '@kastov/mantine-react-table-open'
/* eslint-disable camelcase */
import { GetHwidDevicesCommand } from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { formatTimeUtil } from '@shared/utils/time-utils'

export const useHwidInspectorTableColumns = () => {
    const { t, i18n } = useTranslation()

    return useMemo<MRT_ColumnDef<GetHwidDevicesCommand.Response['response']['devices'][number]>[]>(
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
                header: t('common.field.platform'),
                accessorFn: (originalRow) => originalRow.platform || '–'
            },
            {
                accessorKey: 'osVersion',
                header: t('common.field.os-version'),
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
                header: t('common.field.user-agent'),
                accessorFn: (originalRow) => originalRow.userAgent || '–',
                size: 500
            },

            {
                accessorKey: 'createdAt',
                header: t('common.field.created-at'),
                accessorFn: (originalRow) =>
                    formatTimeUtil({
                        time: originalRow.createdAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    }),

                minSize: 250,
                enableColumnFilter: false,
                enableColumnFilterModes: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },
            {
                accessorKey: 'updatedAt',
                header: t('common.field.updated-at'),
                accessorFn: (originalRow) =>
                    formatTimeUtil({
                        time: originalRow.updatedAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    }),
                minSize: 250,
                enableColumnFilter: false,
                enableColumnFilterModes: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            }
        ],
        [t, i18n.language]
    )
}
