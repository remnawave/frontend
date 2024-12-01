import { UpdateNodeCommand } from '@remnawave/backend-contract'

export interface IEditModal {
    isLoading: boolean
    isOpen: boolean
    node: null | UpdateNodeCommand.Response['response']
}
