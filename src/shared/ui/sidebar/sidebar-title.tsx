import { Text } from '@mantine/core'
import { useMemo } from 'react'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { parseColoredTextUtil } from '@shared/utils/misc'

import classes from './sidebar.module.css'

export const SidebarTitleShared = () => {
    const { data: authStatus } = useGetAuthStatus()

    const titleParts = useMemo(() => {
        if (authStatus?.branding.title) {
            return parseColoredTextUtil(authStatus.branding.title)
        }

        return [
            { text: 'Remna', color: 'cyan' },
            { text: 'wave', color: 'white' }
        ]
    }, [authStatus?.branding.title])

    return (
        <Text className={classes.logoTitle}>
            {titleParts.map((part, index) => (
                <Text c={part.color || 'white'} component="span" inherit key={index}>
                    {part.text}
                </Text>
            ))}
        </Text>
    )
}
