import { GetAllNodesCommand, GetPubKeyCommand } from '@remnawave/backend-contract'
import { IEditModal } from './edit-modal.interface'

export interface IState {
    isNodesLoading: boolean
    nodes: GetAllNodesCommand.Response['response'] | null
    editModal: IEditModal
    createModal: {
        isOpen: boolean
        isLoading: boolean
    }
    pubKey: GetPubKeyCommand.Response['response'] | null
}
