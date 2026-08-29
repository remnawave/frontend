import type { SetFloatingWindowPosition } from '@mantine/hooks'

import { useRef, useState } from 'react'

export interface IWindowGeometry {
    height: number
    isMaximized: boolean
    left: number
    top: number
    width: number
}

const CONSTRAIN_OFFSET = 1
const MIN_WIDTH = 420
const MIN_HEIGHT = 320
const DEFAULT_WIDTH = 960
const DEFAULT_HEIGHT = 640
const DEFAULT_LEFT = 120
const DEFAULT_TOP = 80

export const defaultGeometry = (): IWindowGeometry => {
    const width = Math.min(DEFAULT_WIDTH, window.innerWidth - 2 * CONSTRAIN_OFFSET)
    const height = Math.min(DEFAULT_HEIGHT, window.innerHeight - 2 * CONSTRAIN_OFFSET)

    return {
        height,
        isMaximized: false,
        left: Math.max(
            CONSTRAIN_OFFSET,
            Math.min(DEFAULT_LEFT, window.innerWidth - width - CONSTRAIN_OFFSET)
        ),
        top: Math.max(
            CONSTRAIN_OFFSET,
            Math.min(DEFAULT_TOP, window.innerHeight - height - CONSTRAIN_OFFSET)
        ),
        width
    }
}

export function useWindowGeometry(
    geometry: IWindowGeometry,
    onGeometryChange: (geometry: IWindowGeometry) => void
) {
    const [isMaximized, setIsMaximized] = useState(geometry.isMaximized)
    const [isMinimized, setIsMinimized] = useState(false)

    const pendingRef = useRef(geometry)
    const setPositionRef = useRef<null | SetFloatingWindowPosition>(null)

    const commit = (patch: Partial<IWindowGeometry>) => {
        pendingRef.current = { ...pendingRef.current, ...patch }
        onGeometryChange(pendingRef.current)
    }

    const restore = () => {
        if (!isMinimized) return

        setIsMinimized(false)

        const { height, left, top, width } = pendingRef.current
        const nextLeft = Math.max(0, Math.min(left, window.innerWidth - width - CONSTRAIN_OFFSET))
        const nextTop = Math.max(0, Math.min(top, window.innerHeight - height - CONSTRAIN_OFFSET))

        if (nextLeft === left && nextTop === top) return

        setPositionRef.current?.({ left: nextLeft, top: nextTop })
        commit({ left: nextLeft, top: nextTop })
    }

    const toggleMinimized = () => {
        if (isMinimized) {
            restore()

            return
        }

        setIsMinimized(true)
        setIsMaximized(false)
        commit({ isMaximized: false })
    }

    const toggleMaximized = () => {
        const next = !isMaximized

        commit({ isMaximized: next })
        setIsMaximized(next)
        setIsMinimized(false)
    }

    return {
        isMaximized,
        isMinimized,
        restore,
        toggleMaximized,
        toggleMinimized,

        onHeaderDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => {
            if ((event.target as Element).closest('button')) return

            toggleMinimized()
        },

        windowProps: {
            constrainOffset: CONSTRAIN_OFFSET,
            'data-maximized': isMaximized || undefined,
            'data-minimized': isMinimized || undefined,
            dimensions: {
                initialHeight: geometry.height,
                initialWidth: geometry.width,
                minHeight: MIN_HEIGHT,
                minWidth: MIN_WIDTH
            },
            initialPosition: { left: geometry.left, top: geometry.top },
            onDragEnd: () => onGeometryChange(pendingRef.current),
            onPositionChange: (position: { x: number; y: number }) => {
                pendingRef.current = { ...pendingRef.current, left: position.x, top: position.y }
            },
            onResizeEnd: () => onGeometryChange(pendingRef.current),
            onSizeChange: (size: { height: number; width: number }) => {
                pendingRef.current = {
                    ...pendingRef.current,
                    height: size.height,
                    width: size.width
                }
            },
            setPositionRef
        }
    }
}
