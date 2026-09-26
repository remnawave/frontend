import { useCallback, useEffect, useState } from 'react'

import type { IConnectionProfile } from '@entities/ssh-vault'
import { useSshVaultActions } from '@entities/ssh-vault'

export function useSshProfiles(isUnlocked: boolean) {
    const vaultActions = useSshVaultActions()

    const [profiles, setProfiles] = useState<IConnectionProfile[] | null>(null)

    useEffect(() => {
        if (!isUnlocked) return

        let cancelled = false

        vaultActions.listProfiles().then((list) => {
            if (!cancelled) setProfiles(list)
        })

        return () => {
            cancelled = true
        }
    }, [isUnlocked])

    const refresh = useCallback(async () => {
        setProfiles(await vaultActions.listProfiles())
    }, [vaultActions])

    const clear = useCallback(() => setProfiles([]), [])

    return { clear, profiles, refresh }
}
