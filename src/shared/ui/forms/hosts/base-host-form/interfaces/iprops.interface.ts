import {
    CreateHostCommand,
    GetFullInboundsCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'

export interface IProps<T extends CreateHostCommand.Request | UpdateHostCommand.Request> {
    advancedOpened: boolean
    form: UseFormReturnType<T>
    handleSubmit: () => void
    host?: UpdateHostCommand.Response['response']
    inbounds: GetFullInboundsCommand.Response['response']
    isSubmitting: boolean
    setAdvancedOpened: (value: boolean) => void
}
