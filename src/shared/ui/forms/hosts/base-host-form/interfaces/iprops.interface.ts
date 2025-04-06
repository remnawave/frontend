import {
    CreateHostCommand,
    GetInboundsCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'

export interface IProps<T extends CreateHostCommand.Request | UpdateHostCommand.Request> {
    advancedOpened: boolean
    form: UseFormReturnType<T>
    handleCloneHost?: () => void
    handleSubmit: () => void
    host?: UpdateHostCommand.Response['response']
    inbounds: GetInboundsCommand.Response['response']
    isSubmitting: boolean
    setAdvancedOpened: (value: boolean) => void
}
