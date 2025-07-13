import { ListViewTable } from '@gfazioli/mantine-list-view-table'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { Table } from '@mantine/core'
import dayjs from 'dayjs'

import { useBandwidthTableColumns } from '@features/dashboard/nodes-bandwidth-table/bandwidth-table-columns/model/use-bandwidth-table-columns'
import { DataTableShared } from '@shared/ui/table'
import { useGetNodes } from '@shared/api/hooks'

export function NodesBandwidthTableWidget() {
    const { data: nodes, isLoading } = useGetNodes({
        rQueryParams: {
            select: (data: unknown) => {
                const nodes = data as GetAllNodesCommand.Response['response']
                return nodes.filter((node) => node.isTrafficTrackingActive)
            }
        }
    })
    const { t } = useTranslation()

    const tableColumns = useBandwidthTableColumns()

    return (
        <DataTableShared.Container>
            <DataTableShared.Title
                description={t('table.widget.only-active-nodes')}
                title={`${t('table.widget.today')}: ${dayjs().format('DD MMMM')}`}
            />
            <DataTableShared.Content>
                <Table.ScrollContainer minWidth={1200}>
                    <ListViewTable
                        columns={tableColumns}
                        data={nodes ?? []}
                        emptyText="Nodes with active traffic tracking not found."
                        highlightOnHover
                        loading={isLoading}
                        rowKey="uuid"
                        stripedColor="cyan"
                        withColumnBorders={false}
                    />
                </Table.ScrollContainer>
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
