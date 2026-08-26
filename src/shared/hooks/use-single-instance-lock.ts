import { useEffect, useState } from 'react'

export type TInstanceLock = 'acquired' | 'blocked' | 'pending'

export function useSingleInstanceLock(name: string): TInstanceLock {
    const [state, setState] = useState<TInstanceLock>(() =>
        'locks' in navigator ? 'pending' : 'acquired'
    )

    useEffect(() => {
        if (!('locks' in navigator)) return undefined

        const controller = new AbortController()
        let release: (() => void) | undefined
        let cancelled = false

        const hold = () =>
            new Promise<void>((resolve) => {
                if (cancelled) {
                    resolve()
                    return
                }

                release = resolve
                setState('acquired')
            })

        const acquire = async () => {
            let wasFree = false

            await navigator.locks.request(name, { ifAvailable: true }, (lock) => {
                wasFree = Boolean(lock)
                return lock ? hold() : undefined
            })

            if (wasFree || cancelled) return

            setState('blocked')

            await navigator.locks.request(name, { signal: controller.signal }, hold)
        }

        void acquire().catch(() => {})

        return () => {
            cancelled = true
            controller.abort()
            release?.()
        }
    }, [name])

    return state
}
