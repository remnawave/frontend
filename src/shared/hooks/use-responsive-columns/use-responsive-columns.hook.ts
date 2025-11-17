import { useEffect, useState } from 'react'

export interface ResponsiveColumnsBreakpoints {
    /**
     * Default number of columns (for smallest screens)
     * @default 1
     */
    base?: number
    /**
     * Breakpoints map: width -> number of columns
     * Example: { 800: 2, 1200: 3, 1800: 4 }
     * @default { 800: 2, 1000: 3, 1200: 4, 1800: 5, 2400: 6, 3000: 7 }
     */
    breakpoints?: Record<number, number>
}

interface UseResponsiveColumnsResult {
    /**
     * Current number of columns based on window width
     */
    columnCount: number
    /**
     * Current window width
     */
    width: number
}

/**
 * Calculate columns based on width and breakpoints
 */
function calculateColumns(
    width: number,
    base: number,
    breakpoints: Record<number, number>
): number {
    const sortedBreakpoints = Object.entries(breakpoints)
        .map(([width, cols]) => ({ width: Number(width), cols }))
        .sort((a, b) => b.width - a.width)

    for (const breakpoint of sortedBreakpoints) {
        if (width >= breakpoint.width) {
            return breakpoint.cols
        }
    }

    return base
}

/**
 * Hook for calculating responsive column count based on window width
 *
 * @example
 * ```tsx
 * const { columnCount, width } = useResponsiveColumns({
 *   base: 1,
 *   breakpoints: {
 *     800: 2,
 *     1200: 3,
 *     1800: 4,
 *     2400: 5
 *   }
 * })
 *
 * return (
 *   <Grid columns={columnCount}>
 *     {items.map(item => <GridItem key={item.id}>{item}</GridItem>)}
 *   </Grid>
 * )
 * ```
 */
export function useResponsiveColumns(
    config: ResponsiveColumnsBreakpoints
): UseResponsiveColumnsResult {
    const {
        base = 1,
        breakpoints = {
            800: 2,
            1400: 3,
            1500: 4,
            2400: 6,
            3000: 7
        }
    } = config

    const getWindowWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 0)

    const [width, setWidth] = useState(getWindowWidth)
    const [columnCount, setColumnCount] = useState(() =>
        calculateColumns(getWindowWidth(), base, breakpoints)
    )

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth
            setWidth(newWidth)
            setColumnCount(calculateColumns(newWidth, base, breakpoints))
        }

        window.addEventListener('resize', handleResize)

        // Initial calculation
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [base, breakpoints])

    return {
        columnCount,
        width
    }
}
