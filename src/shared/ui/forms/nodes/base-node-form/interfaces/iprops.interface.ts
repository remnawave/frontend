import {
    CreateNodeCommand,
    GetFullInboundsCommand,
    GetOneNodeCommand,
    GetPubKeyCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'

export interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    advancedOpened: boolean
    fetchedNode: GetOneNodeCommand.Response['response'] | undefined
    form: UseFormReturnType<T>
    handleClose: () => void
    handleSubmit: () => void
    inbounds: GetFullInboundsCommand.Response['response'] | undefined
    isUpdateNodePending: boolean
    node: GetOneNodeCommand.Response['response'] | null
    pubKey: GetPubKeyCommand.Response['response'] | undefined
    setAdvancedOpened: (value: boolean) => void
}
