import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

const MIN_FONT_SIZE = 9
const MAX_FONT_SIZE = 24
const DEFAULT_FONT_SIZE = 13

interface IState {
    fontSize: number
}

interface IActions {
    actions: {
        resetZoom: () => void
        zoom: (step: number) => void
    }
}

const clamp = (value: number): number =>
    Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(value)))

export const useTerminalFontStore = create<IActions & IState>()(
    persist(
        devtools(
            (set) => ({
                fontSize: DEFAULT_FONT_SIZE,
                actions: {
                    resetZoom: () => set({ fontSize: DEFAULT_FONT_SIZE }),
                    zoom: (step) => set((state) => ({ fontSize: clamp(state.fontSize + step) }))
                }
            }),
            { name: 'sshTerminalFontStore', anonymousActionType: 'sshTerminalFontStore' }
        ),
        {
            name: 'sshTerminalFontStore',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ fontSize: state.fontSize }),
            merge: (persistedState, currentState) => {
                const persisted = (persistedState ?? {}) as Partial<IState>

                return {
                    ...currentState,
                    fontSize: clamp(Number(persisted.fontSize) || DEFAULT_FONT_SIZE)
                }
            }
        }
    )
)

export const useTerminalFontSize = () => useTerminalFontStore((state) => state.fontSize)
export const useTerminalFontActions = () => useTerminalFontStore((state) => state.actions)
