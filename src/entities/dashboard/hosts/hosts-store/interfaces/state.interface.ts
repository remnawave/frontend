import { GetAllHostsCommand } from '@remnawave/backend-contract'

import { IEditModal } from './edit-modal.interface'

export interface IState {
    createModal: {
        isLoading: boolean
        isOpen: boolean
    }
    editModal: IEditModal
    hosts: GetAllHostsCommand.Response['response'] | null
    isHostsLoading: boolean
    selectedInboundTag: string
}
