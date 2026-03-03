import { useEffect, useState } from 'react'

import { useAppshellStoreActions } from '@entities/dashboard/appshell'

import { InfraBillingPageComponent } from '../components/infra-billing.page.component'

export function InfraBillingPageConnector() {
    const { hideDesktopSidebar, showDesktopSidebar } = useAppshellStoreActions()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        hideDesktopSidebar()
        const timer = setTimeout(() => setReady(true), 50)
        return () => {
            clearTimeout(timer)
            showDesktopSidebar()
        }
    }, [hideDesktopSidebar, showDesktopSidebar])

    if (!ready) return null

    return <InfraBillingPageComponent />
}
