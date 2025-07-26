import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import { EasterEggStore } from './interfaces/easter-egg-store.interface'

const EASTER_EGG_CLICK_THRESHOLD = 100

export const useEasterEggStore = create<EasterEggStore>()(
    persist(
        (set, get) => ({
            clickCount: 0,
            isEasterEggUnlocked: false,
            isGameModalOpen: false,

            incrementClick: () => {
                const currentCount = get().clickCount + 1
                const isUnlocked = currentCount >= EASTER_EGG_CLICK_THRESHOLD

                set({
                    clickCount: currentCount,
                    isEasterEggUnlocked: isUnlocked
                })

                // Если достигли порога - автоматически открываем игру
                if (isUnlocked && currentCount === EASTER_EGG_CLICK_THRESHOLD) {
                    get().openGameModal()
                }
            },

            openGameModal: () => {
                set({ isGameModalOpen: true })
            },

            closeGameModal: () => {
                set({ isGameModalOpen: false })
            },

            resetClicks: () => {
                set({
                    clickCount: 0,
                    isEasterEggUnlocked: false,
                    isGameModalOpen: false
                })
            }
        }),
        {
            name: 'easter-egg-storage',
            version: 1
        }
    )
)
