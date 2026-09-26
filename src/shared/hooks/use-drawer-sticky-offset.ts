import { useCallback } from 'react'

const STICKY_OFFSET = '--drawer-sticky-offset'
const DRAWER_CONTENT = '.mantine-Drawer-content'
const DRAWER_HEADER = '.mantine-Drawer-header'

export function useDrawerStickyOffset() {
    return useCallback((node: HTMLElement | null) => {
        if (!node) return undefined

        const header = node.closest(DRAWER_CONTENT)?.querySelector(DRAWER_HEADER)

        if (!header) {
            node.style.setProperty(STICKY_OFFSET, '0px')

            return undefined
        }

        const observer = new ResizeObserver(() => {
            node.style.setProperty(STICKY_OFFSET, `${header.getBoundingClientRect().height}px`)
        })

        observer.observe(header)

        return () => observer.disconnect()
    }, [])
}
