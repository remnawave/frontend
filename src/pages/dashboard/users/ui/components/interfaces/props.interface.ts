import { DataTableColumn } from 'mantine-datatable'

import { DataTableReturn } from '@pages/dashboard/users/ui/connectors/interfaces'
import { User } from '@entitites/dashboard/users/models'

export interface IProps {
    columns: DataTableColumn<User>[]
    handlePageChange: (page: number) => void
    handleRecordsPerPageChange: (recordsPerPage: number) => void
    handleSortStatusChange: (status: { columnAccessor: string; direction: 'asc' | 'desc' }) => void
    handleUpdate: () => void
    tabs: DataTableReturn<User>
}
