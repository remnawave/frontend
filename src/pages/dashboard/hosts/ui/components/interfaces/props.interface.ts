import { Dispatch, SetStateAction } from 'react';
import { GetAllUsersCommand } from '@remnawave/backend-contract';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { User } from '@/entitites/dashboard/users/models';
import { DataTableReturn } from '@/pages/dashboard/users/ui/connectors/interfaces';

export interface IProps {}
