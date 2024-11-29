import { UpdateHostCommand } from '@remnawave/backend-contract'

export interface IFormValues extends UpdateHostCommand.Request {
    username: string
    shortUuid: string
    trojanPassword: string
}
