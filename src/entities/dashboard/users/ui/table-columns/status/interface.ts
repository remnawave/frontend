import { User } from '@entities/dashboard/users/models'

export interface IProps {
    need?: 'badge' | 'both' | 'date'
    user: User
}
