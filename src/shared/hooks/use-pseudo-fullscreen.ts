import { useDisclosure, useWindowEvent } from '@mantine/hooks'
import { useEffect, useId } from 'react'

export interface UsePseudoFullscreenReturn {
    close: () => void
    isFullscreen: boolean
    open: () => void
    toggle: () => void
}

const activeFullscreens = new Set<string>()

export const isPseudoFullscreenActive = () => activeFullscreens.size > 0

export function usePseudoFullscreen(initial = false): UsePseudoFullscreenReturn {
    const [isFullscreen, { toggle, open, close }] = useDisclosure(initial)

    const id = useId()

    useEffect(() => {
        if (!isFullscreen) return undefined

        activeFullscreens.add(id)

        return () => {
            activeFullscreens.delete(id)
        }
    }, [id, isFullscreen])

    useWindowEvent('keydown', (event) => {
        if (isFullscreen && event.key === 'Escape') close()
    })

    return { close, isFullscreen, open, toggle }
}
