import { useNavigate } from 'react-router-dom'
import { Image } from '@mantine/core'
import { useState } from 'react'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

import classes from './sidebar.module.css'
import { Logo } from '../logo'

export const SidebarLogoShared = () => {
    const { incrementClick, isEasterEggUnlocked } = useEasterEggStore()
    const [isLogoAnimating, setIsLogoAnimating] = useState(false)
    const { data: authStatus } = useGetAuthStatus()

    const navigate = useNavigate()

    const handleClick = () => {
        if (isEasterEggUnlocked) {
            navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)
            return
        }

        incrementClick()
        setIsLogoAnimating(true)
        setTimeout(() => setIsLogoAnimating(false), 200)
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

    if (isEasterEggUnlocked) {
        return (
            <Logo
                c="pink"
                className={classes.fadeIn}
                onClick={() => navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)}
                style={{ cursor: 'pointer' }}
                w="2.5rem"
            />
        )
    }

    return (
        <Logo
            c={isLogoAnimating ? 'pink' : 'cyan'}
            className={classes.fadeIn}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            w="2.5rem"
        />
    )
}
