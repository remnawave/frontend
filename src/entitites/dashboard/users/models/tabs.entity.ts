import { IGetTabData, User } from '@/entitites/dashboard/users/models/interfaces'
import { DataTable } from '@/shared/ui/stuff/data-table'
import { UseDataTableArgs } from '@/shared/ui/stuff/data-table/use-data-table'

export function getTabDataUsers(data: IGetTabData) {
    return DataTable.useDataTable<User>({
        tabsConfig: {
            tabs: [
                {
                    value: '*',
                    label: 'All',
                    counter: data.totalUsers || 0
                },
                {
                    value: 'ACTIVE',
                    label: 'Active',
                    color: 'teal',
                    counter: data.activeUsers || 0
                },
                {
                    value: 'DISABLED',
                    label: 'Disabled',
                    color: 'gray',
                    counter: data.disabledUsers || 0
                },
                {
                    value: 'EXPIRED',
                    label: 'Expired',
                    color: 'red',
                    counter: data.expiredUsers || 0
                },
                {
                    value: 'LIMITED',
                    label: 'Limited',
                    color: 'orange',
                    counter: data.limitedUsers || 0
                }
            ]
        }
    })
}
