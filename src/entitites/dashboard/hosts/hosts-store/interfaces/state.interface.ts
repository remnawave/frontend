import { GetAllHostsCommand } from '@remnawave/backend-contract'
import { IEditModal } from './edit-modal.interface'

export interface IState {
    isHostsLoading: boolean
    hosts: GetAllHostsCommand.Response['response'] | null
    selectedInboundTag: string
    editModal: IEditModal
    createModal: {
        isOpen: boolean
        isLoading: boolean
    }
}
