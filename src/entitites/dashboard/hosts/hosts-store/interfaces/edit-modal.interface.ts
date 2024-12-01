import { UpdateHostCommand } from '@remnawave/backend-contract'

export interface IEditModal {
    host: null | UpdateHostCommand.Response['response']
    isLoading: boolean
    isOpen: boolean
}
