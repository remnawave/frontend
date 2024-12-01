import invariant from 'tiny-invariant'
import { useContext } from 'react'

import { AuthContext } from '@shared/providers/auth-provider'

export function useAuth() {
    const context = useContext(AuthContext)
    invariant(context, 'useAuth must be used within an AuthProvider')
    return context
}
