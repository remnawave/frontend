import { useContext } from 'react';
import { AuthContext } from '@shared/providers/auth-provider';
import invariant from 'tiny-invariant';

export function useAuth() {
    const context = useContext(AuthContext);
    invariant(context, 'useAuth must be used within an AuthProvider');
    return context;
}
