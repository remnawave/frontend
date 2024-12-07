import { IEditModal } from './edit-modal.interface'

export interface IState {
    createModal: {
        isLoading: boolean
        isOpen: boolean
    }
    editModal: IEditModal
    selectedInboundTag: string
}
