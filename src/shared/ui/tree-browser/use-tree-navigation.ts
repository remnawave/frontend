import { useEffect, useRef, useState } from 'react'

import { ITreeNode, resolvePath } from './build-tree'

const ARROWS = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])

export function useTreeNavigation<T>(tree: ITreeNode<T>[]) {
    const [path, setPath] = useState<string[]>([])
    const [direction, setDirection] = useState(1)
    const [activeIndex, setActiveIndex] = useState(0)

    const rowsRef = useRef<(HTMLElement | null)[]>([])
    const pendingFocus = useRef<null | number>(null)

    const resolved = resolvePath(tree, path)

    if (!resolved && path.length > 0) {
        setPath([])
        setActiveIndex(0)
    }

    const level = resolved ?? tree
    const currentPath = resolved ? path : []
    const focusedIndex = Math.min(activeIndex, Math.max(0, level.length - 1))
    const levelKey = currentPath.join('/')

    useEffect(() => {
        rowsRef.current.length = level.length
    }, [levelKey, level.length])

    const navigate = (next: string[], focusIndex = 0) => {
        pendingFocus.current = focusIndex
        setDirection(next.length >= path.length ? 1 : -1)
        setActiveIndex(focusIndex)
        setPath(next)
    }

    const focusRow = (index: number) => {
        setActiveIndex(index)
        rowsRef.current[index]?.focus()
    }

    const registerRow = (index: number) => (element: HTMLElement | null) => {
        rowsRef.current[index] = element

        if (element && pendingFocus.current === index) {
            pendingFocus.current = null
            element.focus()
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!ARROWS.has(event.key)) return

        const hasRowFocus = rowsRef.current.some((row) => row === document.activeElement)

        if (!hasRowFocus) {
            event.preventDefault()
            focusRow(focusedIndex)
            return
        }

        const node = level[focusedIndex]

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                focusRow(Math.min(focusedIndex + 1, level.length - 1))
                break
            case 'ArrowUp':
                event.preventDefault()
                focusRow(Math.max(focusedIndex - 1, 0))
                break
            case 'ArrowRight':
                if (!node || node.children.length === 0) return
                event.preventDefault()
                navigate([...currentPath, node.label], 0)
                break
            case 'ArrowLeft': {
                if (currentPath.length === 0) return
                event.preventDefault()

                const leaving = currentPath[currentPath.length - 1]
                const parent = resolvePath(tree, currentPath.slice(0, -1)) ?? tree
                const index = parent.findIndex((child) => child.label === leaving)

                navigate(currentPath.slice(0, -1), index === -1 ? 0 : index)
                break
            }
            default:
        }
    }

    return {
        currentPath,
        direction,
        focusedIndex,
        handleKeyDown,
        level,
        levelKey,
        navigate,
        registerRow,
        setActiveIndex
    }
}
