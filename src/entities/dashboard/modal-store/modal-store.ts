import { create, StateCreator } from 'zustand'

import { ModalInternalStates, MODALS } from './modal-states'

export interface ModalsSlice {
    close: (modalKey: ModalKeys) => void
    modals: ModalState
    open: (modalKey: ModalKeys) => void
    resetModalToDefault: (modalKey: ModalKeys) => void
    setInternalData: <K extends ModalKeys>(payload: {
        internalState: ModalInternalStates[K]
        modalKey: K
    }) => void
}

interface BaseModalState<T = unknown> {
    internalState?: T
    isOpen: boolean
}

type ModalKeys = keyof typeof MODALS

type ModalState = {
    [K in ModalKeys]: BaseModalState<ModalInternalStates[K]>
}

const createModals = (keys: ModalKeys[]): ModalState => {
    const initialModalsState: Partial<ModalState> = {}
    keys.forEach((key) => {
        const modalEntry: { [K in typeof key]?: BaseModalState<ModalInternalStates[K]> } = {
            [key]: {
                isOpen: false,
                internalState: undefined
            }
        }
        Object.assign(initialModalsState, modalEntry)
    })
    return initialModalsState as ModalState
}

export const modalsInitialState = createModals(Object.keys(MODALS) as ModalKeys[])

const createModalsSlice: StateCreator<ModalsSlice, [], [], ModalsSlice> = (set) => ({
    modals: { ...modalsInitialState },
    open: (modalKey: ModalKeys) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modalKey]: { ...state.modals[modalKey], isOpen: true }
            }
        })),
    close: (modalKey: ModalKeys) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [modalKey]: { ...state.modals[modalKey], isOpen: false }
            }
        })),
    setInternalData: <K extends ModalKeys>(payload: {
        internalState: ModalInternalStates[K]
        modalKey: K
    }) =>
        set((state) => ({
            modals: {
                ...state.modals,
                [payload.modalKey]: {
                    ...state.modals[payload.modalKey],
                    internalState: payload.internalState
                }
            }
        })),
    resetModalToDefault: (modalKey: ModalKeys) =>
        set((state) => ({
            modals: { ...state.modals, [modalKey]: { isOpen: false } }
        }))
})

export const useModalsStore = create<ModalsSlice>()((...a) => ({
    ...createModalsSlice(...a)
}))

export const useModalsStoreOpen = () => useModalsStore((state) => state.open)
export const useModalsStoreSetInternalData = () => useModalsStore((state) => state.setInternalData)

export const useModalsStoreOpenWithData = () => {
    const open = useModalsStore((state) => state.open)
    const setInternalData = useModalsStore((state) => state.setInternalData)

    return <K extends ModalKeys>(modalKey: K, internalState: ModalInternalStates[K]) => {
        setInternalData({ modalKey, internalState })
        open(modalKey)
    }
}

export const useModalClose = (modalKey: ModalKeys) => {
    const close = useModalsStore((state) => state.close)
    const setInternalData = useModalsStore((state) => state.setInternalData)
    return () => {
        close(modalKey)
        setInternalData({ modalKey, internalState: undefined })
    }
}

export const useModalCloseActions = (modalKey: ModalKeys) => {
    const close = useModalsStore((state) => state.close)
    const setInternalData = useModalsStore((state) => state.setInternalData)

    const handleClose = () => {
        close(modalKey)
    }

    const clearInternalState = () => {
        setInternalData({ modalKey, internalState: undefined })
    }

    return [handleClose, clearInternalState] as const
}

export const useModalState = <K extends ModalKeys>(modalKey: K) => {
    return useModalsStore((state) => state.modals[modalKey])
}

export const useModalIsOpen = (modalKey: ModalKeys) => {
    return useModalsStore((state) => state.modals[modalKey].isOpen)
}

// export const useModalOpenWithData = <K extends ModalKeys>(modalKey: K) => {
//     const open = useModalsStore((state) => state.open)
//     const setInternalData = useModalsStore((state) => state.setInternalData)

//     return (internalState: ModalInternalStates[K]) => {
//         setInternalData({ modalKey, internalState })
//         open(modalKey)
//     }
// }
// const openInbounds = useModalOpenWithData(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)
