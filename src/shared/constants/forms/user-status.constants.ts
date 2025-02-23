import { USERS_STATUS } from '@remnawave/backend-contract'

export const userStatusValues = [
    { value: USERS_STATUS.ACTIVE, label: 'Active' },
    { value: USERS_STATUS.LIMITED, label: 'Limited' },
    { value: USERS_STATUS.DISABLED, label: 'Disabled' },
    { value: USERS_STATUS.EXPIRED, label: 'Expired' }
]
