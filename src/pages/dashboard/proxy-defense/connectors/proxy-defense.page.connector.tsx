import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

import { ProxyDefensePage } from '../components/proxy-defense.page'

export const ProxyDefensePageConnector = () => {
    const navigate = useNavigate()
    const { isEasterEggUnlocked } = useEasterEggStore()

    useEffect(() => {
        if (!isEasterEggUnlocked) {
            navigate(ROUTES.DASHBOARD.HOME, { replace: true })
        }
    }, [isEasterEggUnlocked, navigate])

    if (!isEasterEggUnlocked) {
        return null
    }

    return <ProxyDefensePage />
}
