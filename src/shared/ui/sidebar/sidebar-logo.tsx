import { useNavigate } from 'react-router-dom'
import { Image } from '@mantine/core'
import { useState } from 'react'

import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

import { Logo } from '../logo'

interface IProps {
    logoUrl?: null | string
}

export const SidebarLogoShared = ({ logoUrl }: IProps) => {
    const { incrementClick, isEasterEggUnlocked } = useEasterEggStore()
    const [isLogoAnimating, setIsLogoAnimating] = useState(false)
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

    if (logoUrl) {
        return (
            <Image
                alt="logo"
                fallbackSrc="/favicons/logo.svg"
                fit="contain"
                onClick={handleClick}
                src={logoUrl}
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
                onClick={() => navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)}
                style={{ cursor: 'pointer' }}
                w="2.5rem"
            />
        )
    }

    return (
        <Logo
            c={isLogoAnimating ? 'pink' : 'cyan'}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            w="2.5rem"
        />
    )
}
