import { Dispatch, SetStateAction } from 'react';
import { GetAllUsersCommand } from '@remnawave/backend-contract';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { User } from '@/entitites/dashboard/users/models';
import { DataTableReturn } from '@/pages/dashboard/users/ui/connectors/interfaces';

export interface IProps {
    users: User[];
    tabs: DataTableReturn<User>;
    setSearch: Dispatch<SetStateAction<string>>;
    search: string;
    setSearchBy: Dispatch<SetStateAction<GetAllUsersCommand.SearchableField>>;
    searchBy: string;
    columns: DataTableColumn<User>[];
    handleSortStatusChange: (status: { columnAccessor: string; direction: 'asc' | 'desc' }) => void;
    handlePageChange: (page: number) => void;
    handleRecordsPerPageChange: (recordsPerPage: number) => void;
    handleUpdate: () => void;
}
