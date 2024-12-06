import { inferQueryKeyStore, mergeQueryKeys } from '@lukemorales/query-key-factory'

import { usersQueryKeys } from './users/users.hooks'

export const QueryKeys = mergeQueryKeys(usersQueryKeys)

export type TQueryKeys = inferQueryKeyStore<typeof QueryKeys>
