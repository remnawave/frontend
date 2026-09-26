import NiceModal from '@ebay/nice-modal-react'
import { useContext, useEffect, useEffectEvent } from 'react'

import { logoutEvents } from '@shared/emitters'

export function NiceModalAutoClose() {
    const modals = useContext(NiceModal.NiceModalContext)

    const closeAll = useEffectEvent(() => {
        Object.keys(modals).forEach((id) => NiceModal.remove(id))
    })

    useEffect(() => logoutEvents.subscribe(closeAll), [])

    return null
}
