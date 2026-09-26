import { UseFormReturnType } from '@mantine/form'
import {
    CreateHostCommand,
    UpdateHostCommand,
    UpdateManyHostsCommand
} from '@remnawave/backend-contract'

export type THostFormValues = Partial<
    CreateHostCommand.RequestBody &
        UpdateHostCommand.RequestBody &
        UpdateManyHostsCommand.RequestBody
>

export type THostForm = UseFormReturnType<THostFormValues>
