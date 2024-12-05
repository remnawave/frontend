import { GetAllNodesCommand, GetPubKeyCommand } from '@remnawave/backend-contract'

import { IEditModal } from './edit-modal.interface'

export interface IState {
    createModal: {
        isLoading: boolean
        isOpen: boolean
    }
    editModal: IEditModal
    isNodesLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | null
    pubKey: GetPubKeyCommand.Response['response'] | null
}
