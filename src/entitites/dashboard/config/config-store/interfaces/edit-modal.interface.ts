import { UpdateNodeCommand } from '@remnawave/backend-contract'

export interface IEditModal {
    isOpen: boolean
    node: UpdateNodeCommand.Response['response'] | null
    isLoading: boolean
}
