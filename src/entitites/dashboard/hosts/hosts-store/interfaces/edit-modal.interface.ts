import { UpdateHostCommand } from '@remnawave/backend-contract'

export interface IEditModal {
    isOpen: boolean
    host: UpdateHostCommand.Response['response'] | null
    isLoading: boolean
}
