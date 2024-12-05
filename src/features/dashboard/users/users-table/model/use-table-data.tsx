import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { GetAllUsersV2Command } from '@remnawave/backend-contract'

import { useDashboardStoreActions } from '@entities/dashboard/dashboard-store/dashboard-store'
import { sToMs } from '@shared/utils/time-utils'

import { TableParams } from './interfaces'

export const useUserTableData = (tableParams: TableParams) => {
    const { columnFilterFns, columnFilters, sorting, pagination } = tableParams

    const actions = useDashboardStoreActions()

    const params = {
        start: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        filters: columnFilters ?? [],
        filterModes: columnFilterFns ?? {},
        sorting: sorting ?? []
    }

    return useQuery<GetAllUsersV2Command.Response['response']>({
        queryKey: ['users', params],
        queryFn: async () => {
            const data = await actions.getUsersV2({
                start: params.start,
                size: params.size,
                filters: JSON.stringify(params.filters),
                filterModes: JSON.stringify(params.filterModes),
                globalFilter: '',
                sorting: JSON.stringify(params.sorting)
            })
            if (!data) {
                return Promise.reject(new Error('Oh no!'))
            }

            return data
        },
        placeholderData: keepPreviousData,
        staleTime: sToMs(20),
        refetchInterval: sToMs(25),
        refetchOnWindowFocus: true
    })
}
