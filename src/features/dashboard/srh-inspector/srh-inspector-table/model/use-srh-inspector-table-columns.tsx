/* eslint-disable camelcase */
import { GetSubscriptionRequestHistoryCommand } from '@remnawave/backend-contract'
import { MRT_ColumnDef } from 'mantine-react-table'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import dayjs from 'dayjs'

export const useSrhInspectorTableColumns = () => {
    const { t } = useTranslation()

    return useMemo<
        MRT_ColumnDef<
            GetSubscriptionRequestHistoryCommand.Response['response']['records'][number]
        >[]
    >(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                accessorFn: (originalRow) => originalRow.id,
                size: 80
            },
            {
                accessorKey: 'requestIp',
                header: t('use-srh-inspector-table-columns.request-ip'),
                accessorFn: (originalRow) => originalRow.requestIp || '–'
            },
            {
                accessorKey: 'userAgent',
                header: t('use-srh-inspector-table-columns.user-agent'),
                accessorFn: (originalRow) => originalRow.userAgent || '–',
                size: 500
            },
            {
                accessorKey: 'requestAt',
                header: t('use-srh-inspector-table-columns.request-at'),
                accessorFn: (originalRow) =>
                    dayjs(originalRow.requestAt).format('DD/MM/YYYY, HH:mm'),
                minSize: 250
            },
            {
                accessorKey: 'userUuid',
                header: t('use-srh-inspector-table-columns.user-uuid'),
                accessorFn: (originalRow) => originalRow.userUuid || '–',
                size: 300
            }
        ],
        []
    )
}
