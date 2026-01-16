import { useNavigate } from 'react-router-dom'
import { Image } from '@mantine/core'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { ROUTES } from '@shared/constants'

import classes from './sidebar.module.css'
import { Logo } from '../logo'

export const SidebarLogoShared = () => {
    const { data: authStatus } = useGetAuthStatus()

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(ROUTES.DASHBOARD.HOME)
    }

    if (authStatus?.branding.logoUrl) {
        return (
            <Image
                alt="logo"
                className={classes.fadeIn}
                fallbackSrc="/favicons/logo.svg"
                fit="contain"
                onClick={handleClick}
                src={authStatus.branding.logoUrl}
                style={{
                    maxWidth: '30px',
                    maxHeight: '30px',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer'
                }}
            />
        )
    }

    return (
        <Logo
            c="cyan"
            className={classes.fadeIn}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            w="2.5rem"
        />
    )
}
