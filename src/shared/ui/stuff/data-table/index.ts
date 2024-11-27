import { DataTable as MantineDataTable } from 'mantine-datatable';
import { capitalize } from '@/shared/utils/text';
import { CardTitle } from '../card-title';
import { DataTableActions } from './data-table-actions';
import { DataTableContainer } from './data-table-container';
import { DataTableContent } from './data-table-content';
import { DataTableFilters } from './data-table-filters';
import { DataTableTabs } from './data-table-tabs';
import { DataTableTextInputFilter } from './data-table-text-input-filter';
import { useDataTable } from './use-data-table';

export const DataTable = {
  useDataTable,
  Title: CardTitle,
  Container: DataTableContainer,
  Content: DataTableContent,
  Tabs: DataTableTabs,
  Filters: DataTableFilters,
  Actions: DataTableActions,
  Table: MantineDataTable,
  TextInputFilter: DataTableTextInputFilter,
  recordsPerPageLabel: (resource: string) => `${capitalize(resource)} per page`,
  noRecordsText: (resource: string) => `No ${resource} found`,
  paginationText:
    (resource: string) =>
    ({ from, to, totalRecords }: { from: number; to: number; totalRecords: number }) =>
      `Showing ${from} to ${to} of ${totalRecords} ${resource}`,
};
