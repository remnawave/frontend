// import { create, StateCreator } from 'zustand'

// export const MODALS = {
//     RANDOM_MODAL_NAME: 'RANDOM_MODAL_NAME',
//     RANDOM_MODAL_NAME_2: 'RANDOM_MODAL_NAME_2'
// } as const

// export interface ModalsSlice {
//     close: (modalKey: MODALS) => void
//     modals: ModalState
//     open: (modalKey: MODALS) => void
//     resetModalToDefault: (modalKey: MODALS) => void
//     setInternalData: (payload: { internalState: unknown; modalKey: MODALS }) => void
// }
// interface BaseModalState {
//     internalState?: unknown
//     isOpen: boolean
// }

// type MODALS = (typeof MODALS)[keyof typeof MODALS]

// type ModalState = {
//     [K in keyof typeof MODALS]: BaseModalState
// }

// const createModals = (keys: (keyof typeof MODALS)[]): ModalState => {
//     const initialModalsState: Partial<ModalState> = {}
//     keys.forEach((key) => {
//         const modalEntry: { [K in typeof key]?: BaseModalState } = {
//             [key]: {
//                 isOpen: false,
//                 internalState: {}
//             }
//         }
//         Object.assign(initialModalsState, modalEntry)
//     })
//     return initialModalsState as ModalState
// }

// export const modalsInitialState = createModals(Object.keys(MODALS) as (keyof typeof MODALS)[])

// const createModalsSlice: StateCreator<ModalsSlice, [], [], ModalsSlice> = (set) => ({
//     modals: { ...modalsInitialState },
//     open: (modalKey: MODALS) =>
//         set((state) => ({
//             modals: {
//                 ...state.modals,
//                 [modalKey]: { ...state.modals[modalKey], isOpen: true }
//             }
//         })),
//     close: (modalKey: MODALS) =>
//         set((state) => ({
//             modals: {
//                 ...state.modals,
//                 [modalKey]: { ...state.modals[modalKey], isOpen: false }
//             }
//         })),
//     setInternalData: (payload: { internalState: unknown; modalKey: MODALS }) =>
//         set((state) => ({
//             modals: {
//                 ...state.modals,
//                 [payload.modalKey]: {
//                     ...state.modals[payload.modalKey],
//                     internalState: payload.internalState
//                 }
//             }
//         })),
//     resetModalToDefault: (modalKey: MODALS) =>
//         set((state) => ({
//             modals: { ...state.modals, [modalKey]: { isOpen: false } }
//         }))
// })

// export const useModalsStore = create<ModalsSlice>()((...a) => ({
//     ...createModalsSlice(...a)
// }))

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
