import { GetAllUsersV2Command } from '@remnawave/backend-contract'

export type User = GetAllUsersV2Command.Response['response']['users'][0]
