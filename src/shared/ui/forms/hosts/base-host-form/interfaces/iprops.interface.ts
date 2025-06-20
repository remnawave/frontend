import {
    CreateHostCommand,
    GetConfigProfilesCommand,
    UpdateHostCommand
} from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'

export interface IProps<T extends CreateHostCommand.Request | UpdateHostCommand.Request> {
    advancedOpened: boolean
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    form: UseFormReturnType<T>
    handleCloneHost?: () => void
    handleSubmit: () => void
    host?: UpdateHostCommand.Response['response']
    isSubmitting: boolean
    setAdvancedOpened: (value: boolean) => void
}
