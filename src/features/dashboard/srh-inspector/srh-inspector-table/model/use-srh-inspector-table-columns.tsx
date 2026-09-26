import { MRT_ColumnDef } from '@kastov/mantine-react-table-open'
/* eslint-disable camelcase */
import { GetSubscriptionRequestHistoryCommand } from '@remnawave/backend-contract'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { formatTimeUtil } from '@shared/utils/time-utils'

export const useSrhInspectorTableColumns = () => {
    const { t, i18n } = useTranslation()

    return useMemo<
        MRT_ColumnDef<
            GetSubscriptionRequestHistoryCommand.Response['response']['records'][number]
        >[]
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
                accessorKey: 'userAgent',
                header: t('common.field.user-agent'),
                accessorFn: (originalRow) => originalRow.userAgent || '–',
                size: 400
            },
            {
                accessorKey: 'requestAt',
                header: t('common.field.request-at'),
                accessorFn: (originalRow) =>
                    formatTimeUtil({
                        time: originalRow.requestAt,
                        template: 'TIME_FIRST_DATETIME',
                        language: i18n.language
                    }),
                minSize: 250,
                enableColumnFilterModes: false,
                enableColumnFilter: false,
                mantineTableBodyCellProps: {
                    align: 'left',
                    ff: 'monospace'
                }
            },
            {
                accessorKey: 'srrResponseType',
                header: t('use-srh-inspector-table-columns.response-type'),
                accessorFn: (originalRow) => originalRow.srrResponseType,
                size: 200
            },
            {
                accessorKey: 'srrRuleName',
                header: t('use-srh-inspector-table-columns.rule-name'),
                accessorFn: (originalRow) => originalRow.srrRuleName || '–',
                size: 200
            },
            {
                accessorKey: 'id',
                header: 'ID',
                accessorFn: (originalRow) => originalRow.id,
                size: 80
            }
        ],
        [t, i18n.language]
    )
}
