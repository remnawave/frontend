import {
    CreateNodeCommand,
    GetOneNodeCommand,
    GetPubKeyCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'
import { ReactNode } from 'react'

export interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    advancedOpened: boolean
    fetchedNode: GetOneNodeCommand.Response['response'] | undefined
    form: UseFormReturnType<T>
    handleClose: () => void
    handleSubmit: () => void
    isUpdateNodePending: boolean
    node: GetOneNodeCommand.Response['response'] | null
    nodeDetailsCard?: ReactNode
    pubKey: GetPubKeyCommand.Response['response'] | undefined
    setAdvancedOpened: (value: boolean) => void
}
