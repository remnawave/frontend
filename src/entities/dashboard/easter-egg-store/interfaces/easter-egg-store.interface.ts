export interface EasterEggStore {
    clickCount: number
    closeGameModal: () => void
    incrementClick: () => void
    isEasterEggUnlocked: boolean
    isGameModalOpen: boolean
    openGameModal: () => void
    resetClicks: () => void
}
