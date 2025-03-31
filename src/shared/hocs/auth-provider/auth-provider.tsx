import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import consola from 'consola/browser'

import { resetAllStores } from '@shared/hocs/store-wrapper'
import { removeToken, useToken } from '@entities/auth'
import { logoutEvents } from '@shared/emitters'

interface AuthContextValues {
    isAuthenticated: boolean
    isInitialized: boolean
    setIsAuthenticated: (isAuthenticated: boolean) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValues | null>(null)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isLoggedOut, setIsLoggedOut] = useState(false)
    const token = useToken()

    const logoutUser = () => {
        if (isLoggedOut) {
            return
        }

        try {
            setIsLoggedOut(true)
            setIsAuthenticated(false)
            removeToken()
            resetAllStores()
        } finally {
            setIsLoggedOut(false)
        }
    }

    useEffect(() => {
        const unsubscribe = logoutEvents.subscribe(() => {
            logoutUser()
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        ;(async () => {
            if (!token) {
                setIsAuthenticated(false)
                setIsInitialized(true)
                return
            }

            try {
                setIsAuthenticated(true)
                setIsLoggedOut(false)
            } catch (error) {
                consola.error(error)
                logoutUser()
            } finally {
                setIsInitialized(true)
            }
        })()
    }, [])

    const value = useMemo(
        () => ({ isAuthenticated, isInitialized, setIsAuthenticated }),
        [isAuthenticated, isInitialized]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
