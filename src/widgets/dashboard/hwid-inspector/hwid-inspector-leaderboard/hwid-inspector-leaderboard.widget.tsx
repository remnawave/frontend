import { notifications } from '@mantine/notifications'
import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { DataTable } from 'mantine-datatable'
import { useClipboard } from '@mantine/hooks'
import { TbRefresh } from 'react-icons/tb'
import { useState } from 'react'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store'
import { useGetTopUsersByHwidDevices } from '@shared/api/hooks'
import { sToMs } from '@shared/utils/time-utils'

import { getHwidInspectorLeaderboardColumns } from './get-hwid-inspector-leaderboard-columns'

const PAGE_SIZE = 5
const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100]

export function HwidInspectorLeaderboardWidget() {
    const { t } = useTranslation()

    const [pageSize, setPageSize] = useState(PAGE_SIZE)
    const [page, setPage] = useState(1)
    const { copy } = useClipboard()

    const userModalActions = useUserModalStoreActions()

    const {
        data: usersResponse,
        isLoading,
        isFetching,
        refetch
    } = useGetTopUsersByHwidDevices({
        query: {
            start: (page - 1) * pageSize,
            size: pageSize
        },
        rQueryParams: {
            refetchInterval: sToMs(25)
        }
    })

    const handleChangePageSize = (pageSize: number) => {
        setPageSize(pageSize)
        setPage(1)
    }

    return (
        <DataTable
            borderRadius="sm"
            columns={getHwidInspectorLeaderboardColumns(t, async (userUuid) => {
                await userModalActions.setUserUuid(userUuid)
                userModalActions.changeModalState(true)
            })}
            defaultColumnProps={{
                noWrap: true,
                textAlign: 'left',
                ellipsis: true,
                draggable: false
            }}
            fetching={isLoading}
            height={350}
            idAccessor="userUuid"
            onCellClick={({ record, column }) => {
                if (column.accessor === 'actions') {
                    return
                }
                copy(record[column.accessor as keyof typeof record])
                notifications.show({
                    title: t('common.copied'),
                    message: record[column.accessor as keyof typeof record],
                    color: 'teal'
                })
            }}
            onPageChange={setPage}
            onRecordsPerPageChange={handleChangePageSize}
            page={page}
            pinFirstColumn
            records={usersResponse?.users ?? []}
            recordsPerPage={pageSize}
            recordsPerPageLabel=""
            recordsPerPageOptions={PAGE_SIZE_OPTIONS}
            renderPagination={({ Controls }) => (
                <>
                    <Controls.Text />
                    <Tooltip label={t('common.update')} withArrow>
                        <ActionIcon
                            loading={isFetching}
                            onClick={() => refetch()}
                            size="md"
                            variant="light"
                        >
                            <TbRefresh size="20px" />
                        </ActionIcon>
                    </Tooltip>
                    <Controls.PageSizeSelector />
                    <Controls.Pagination />
                </>
            )}
            totalRecords={usersResponse?.total ?? 0}
            withColumnBorders={false}
            withRowBorders={true}
            withTableBorder={true}
        />
    )
}
