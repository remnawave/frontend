import { IEditModal } from './edit-modal.interface'

export interface IFilters {
    configProfileUuid: null | string
    hostTag: null | string
    inboundUuid: null | string
}

export interface IState {
    createModal: {
        isLoading: boolean
        isOpen: boolean
    }
    editModal: IEditModal
    filters: IFilters
}
