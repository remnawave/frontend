import { User } from '@entitites/dashboard/users/models'
import { DataTableReturn } from '@pages/dashboard/users/ui/connectors/interfaces'
import { DataTableColumn } from 'mantine-datatable'

export interface IProps {
    tabs: DataTableReturn<User>
    columns: DataTableColumn<User>[]
    handleSortStatusChange: (status: { columnAccessor: string; direction: 'asc' | 'desc' }) => void
    handlePageChange: (page: number) => void
    handleRecordsPerPageChange: (recordsPerPage: number) => void
    handleUpdate: () => void
}
