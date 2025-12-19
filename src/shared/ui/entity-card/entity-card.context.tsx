import { createContext, useContext } from 'react'

interface EntityCardContextValue {
    menuOpened: boolean
    setMenuOpened: (opened: boolean) => void
}

export const EntityCardContext = createContext<EntityCardContextValue | null>(null)

export const useEntityCardContext = () => {
    const context = useContext(EntityCardContext)
    if (!context) {
        throw new Error('EntityCard components must be used within EntityCard')
    }
    return context
}
