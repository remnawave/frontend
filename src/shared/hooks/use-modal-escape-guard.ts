import { modals } from '@mantine/modals'
import { useEffect } from 'react'

export function useModalEscapeGuard(modalId: string, blocked: boolean) {
    useEffect(() => {
        modals.updateModal({ modalId, closeOnEscape: !blocked })
    }, [blocked, modalId])
}
