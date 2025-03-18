export interface IBulkAllDrawerProps {
    handlers: {
        close: () => void
        open: () => void
    }
    isDrawerOpen: boolean
}
