import type { RefObject } from 'react'

export const scrollLockShards: RefObject<HTMLElement | null>[] = []

export function registerScrollLockShard(node: HTMLElement): () => void {
    const shard: RefObject<HTMLElement | null> = { current: node }

    scrollLockShards.push(shard)

    return () => {
        const index = scrollLockShards.indexOf(shard)
        if (index !== -1) scrollLockShards.splice(index, 1)
    }
}
