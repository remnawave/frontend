import { Text } from '@mantine/core'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'

import classes from './sidebar.module.css'

export const SidebarTitleShared = () => {
    const { data: authStatus } = useGetAuthStatus()

    return (
        <Text className={classes.logoTitle}>
            <Text c={authStatus?.branding.title ? 'white' : 'cyan'} component="span" inherit>
                {authStatus?.branding.title || 'Remna'}
            </Text>
            {authStatus?.branding.title ? '' : 'wave'}
        </Text>
    )
}
