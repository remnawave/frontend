import { UpdateUserCommand } from '@remnawave/backend-contract'

export interface IFormValues extends UpdateUserCommand.Request {
    shortUuid: string
    trojanPassword: string
    username: string
}
