import { useEffect, useMemo, useState } from 'react'

import { MultiSelect, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { GetAllUsersCommand } from '@remnawave/backend-contract'
import { DataTableColumn } from 'mantine-datatable'
import {
    useDashboardStoreActions,
    useDashboardStoreIsLoading,
    useDashboardStoreParams,
    useDashboardStoreSystemInfo,
    useDashboardStoreTotalUsers,
    useDashboardStoreUsers
} from '@/entitites/dashboard/dashboard-store/dashboard-store'
import {
    useHostsStoreHosts,
    useHostsStoreIsLoading
} from '@/entitites/dashboard/hosts/hosts-store/hosts-store'
import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@/entitites/dashboard/user-creation-modal-store/user-creation-modal-store'
import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen
} from '@/entitites/dashboard/user-modal-store/user-modal-store'
import { getTabDataUsers, User } from '@/entitites/dashboard/users/models'
import { DataUsageColumnEntity } from '@/entitites/dashboard/users/ui'
import { ShortUuidColumnEntity } from '@/entitites/dashboard/users/ui/table-columns/short-uuid'
import { StatusColumnEntity } from '@/entitites/dashboard/users/ui/table-columns/status/status.column'
import { UsernameColumnEntity } from '@/entitites/dashboard/users/ui/table-columns/username/username.column'
import HostsPageComponent from '@/pages/dashboard/hosts/ui/components/hosts.page'
import UsersPageComponent from '@/pages/dashboard/users/ui/components/users.page'
import { DataTable } from '@/shared/ui/stuff/data-table'

export function HostsPageConnector() {
    const hosts = useHostsStoreHosts()
    const isHostsLoading = useHostsStoreIsLoading()

    return <HostsPageComponent />
}
