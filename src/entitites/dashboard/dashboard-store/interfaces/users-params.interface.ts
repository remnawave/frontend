import { GetAllUsersCommand } from '@remnawave/backend-contract'

export interface IUsersParams {
    limit: number
    offset: number
    orderBy?: GetAllUsersCommand.SortableField
    orderDir?: 'asc' | 'desc'
    search?: string
    searchBy?: GetAllUsersCommand.SearchableField
}
