import { NiceModalHandler } from '@ebay/nice-modal-react'
import { useCallback, useEffect, useEffectEvent, useState } from 'react'

import { useIsMobile } from '@shared/hooks/use-is-mobile'
import { isPseudoFullscreenActive } from '@shared/hooks/use-pseudo-fullscreen'

const stack: { id: string; hide: () => void }[] = []
let listening = false

function hasManagedModalOpen(): boolean {
    const dialogs = document.querySelectorAll('[role="dialog"]')
    for (const d of dialogs) {
        if (!d.closest('[data-nice-modal]')) return true
    }
    return false
}

function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return
    if (isPseudoFullscreenActive()) return
    if (hasManagedModalOpen()) return
    const top = stack[stack.length - 1]
    if (!top) return
    top.hide()
}

function register(id: string, hide: () => void) {
    const existing = stack.find((m) => m.id === id)
    if (existing) {
        existing.hide = hide
        return
    }
    stack.push({ id, hide })
    if (!listening) {
        document.addEventListener('keydown', handleKeyDown)
        listening = true
    }
}

function unregister(id: string) {
    const i = stack.findIndex((m) => m.id === id)
    if (i !== -1) stack.splice(i, 1)
    if (listening && stack.length === 0) {
        document.removeEventListener('keydown', handleKeyDown)
        listening = false
    }
}

interface IProps {
    modal: NiceModalHandler
    drawer?: boolean
    onClose?: () => void
}

export function useNiceMantineModal(props: IProps) {
    const { modal, drawer, onClose } = props
    const isMobile = useIsMobile()
    const [entered, setEntered] = useState(false)

    const hide = useCallback(() => {
        onClose?.()
        modal.hide()
    }, [onClose, modal])

    const stackHide = useEffectEvent(() => hide())

    useEffect(() => {
        const raf = requestAnimationFrame(() => setEntered(true))
        return () => cancelAnimationFrame(raf)
    }, [])

    useEffect(() => {
        if (!modal.visible) return

        register(modal.id, stackHide)
        return () => unregister(modal.id)
    }, [modal.visible, modal.id])

    const drawerProps = !drawer
        ? {
              fullScreen: isMobile,
              transition: isMobile ? { transition: 'fade', duration: 200 } : undefined,
              centered: true
          }
        : {}

    const modalProps = {
        opened: entered && modal.visible,
        closeOnEscape: false,
        'data-nice-modal': modal.id,
        onClose: hide,
        onExitTransitionEnd: () => modal.remove(),
        ...drawerProps
    }

    return { modalProps, hide }
}
