import { useEffect } from 'react'

interface IUsePreventBackNavigationOptions {
    enabled: boolean
    onBack?: () => void
}

export function usePreventBackNavigation({ enabled, onBack }: IUsePreventBackNavigationOptions) {
    useEffect(() => {
        if (!enabled) {
            return undefined
        }

        window.history.pushState(null, '')

        function handlePopState() {
            onBack?.()
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [enabled, onBack])
}
