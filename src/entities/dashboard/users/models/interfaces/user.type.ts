import { GetAllUsersCommand } from '@remnawave/backend-contract'

export type User = GetAllUsersCommand.Response['response']['users'][0]
