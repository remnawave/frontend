import { useLayoutEffect, useRef } from 'react'

interface IOptions {
    bottomGap?: number
    enabled?: boolean
    minHeight?: number
}

const DEFAULT_BOTTOM_GAP = 32
const DEFAULT_MIN_HEIGHT = 320

export function useViewportFillHeight(options: IOptions = {}) {
    const {
        bottomGap = DEFAULT_BOTTOM_GAP,
        enabled = true,
        minHeight = DEFAULT_MIN_HEIGHT
    } = options

    const containerRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const container = containerRef.current

        if (!container) return undefined

        if (!enabled) {
            container.style.removeProperty('height')
            return undefined
        }

        const updateHeight = () => {
            const documentTop = container.getBoundingClientRect().top + window.scrollY
            const footerHeight = footerRef.current?.getBoundingClientRect().height ?? 0
            const available = window.innerHeight - documentTop - footerHeight - bottomGap

            container.style.height = `${Math.max(available, minHeight)}px`
        }

        updateHeight()

        const footerObserver = new ResizeObserver(updateHeight)

        if (footerRef.current) {
            footerObserver.observe(footerRef.current)
        }

        window.addEventListener('resize', updateHeight)

        return () => {
            footerObserver.disconnect()
            window.removeEventListener('resize', updateHeight)
        }
    }, [bottomGap, enabled, minHeight])

    return { containerRef, footerRef }
}
