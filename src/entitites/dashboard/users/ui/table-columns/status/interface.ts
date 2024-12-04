import { User } from '@/entitites/dashboard/users/models'

export interface IProps {
    need?: 'badge' | 'both' | 'date'
    user: User
}
