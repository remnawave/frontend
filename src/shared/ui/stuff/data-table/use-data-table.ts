import { useMemo, useState } from 'react';
import { DataTableSortStatus } from 'mantine-datatable';
import { useDebouncedValue } from '@mantine/hooks';
import { isDefined } from '@/shared/utils/is';
import { DataTableFilter } from './data-table-filters';
import { DataTableTabsProps } from './data-table-tabs';

export interface UseDataTableArgs<SortableFields> {
    tabsConfig?: DataTableTabsProps;
    sortConfig?: {
        column: DataTableSortStatus<SortableFields>['columnAccessor'];
        direction: DataTableSortStatus<SortableFields>['direction'];
    };
}

export type UseDataTableReturn<SortableFields = any> = ReturnType<
    typeof useDataTable<SortableFields>
>;

export function useDataTable<SortableFields>({
    tabsConfig,
    sortConfig,
}: UseDataTableArgs<SortableFields>) {
    const [currentTab, setCurrentTab] = useState(tabsConfig?.tabs[0].value);
    const [filters, setFilters] = useState<Record<string, DataTableFilter>>({});
    const [debouncedFilters] = useDebouncedValue(filters, 500);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<SortableFields>>({
        columnAccessor: sortConfig?.column ?? '',
        direction: sortConfig?.direction ?? 'asc',
    });

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
        tabsConfig?.onChange?.(value);
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    const handleRemoveFilter = (name: string) => {
        setFilters((prevFilters) => {
            const { [name]: removed, ...rest } = prevFilters;
            return rest;
        });
    };

    const handleChangeFilter = (filter: Omit<DataTableFilter, 'onRemove'>) => {
        if (isDefined(filter.value)) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [filter.name]: {
                    ...filter,
                    onRemove: () => handleRemoveFilter(filter.name),
                },
            }));
        } else {
            handleRemoveFilter(filter.name);
        }
    };

    const queryFormattedFilters = useMemo(
        () =>
            Object.values(debouncedFilters)
                .filter(({ value }) => isDefined(value))
                .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}),
        [debouncedFilters]
    );

    return {
        tabs: {
            value: currentTab,
            change: handleTabChange,
            tabs: tabsConfig?.tabs ?? [],
        },
        filters: {
            filters,
            clear: handleClearFilters,
            change: handleChangeFilter,
            remove: handleRemoveFilter,
            query: queryFormattedFilters,
        },
        sort: {
            change: setSortStatus as any, // TODO: fix type
            column: sortStatus.columnAccessor as keyof SortableFields,
            direction: sortStatus.direction,
            status: sortStatus,
            query: `${sortStatus.columnAccessor.toString()}:${sortStatus.direction}` as const,
        },
    } as const;
}
