type Listener = () => void
type Unsubscribe = () => void

class LogoutEventEmitter {
    private listeners: Set<Listener> = new Set()

    emit() {
        this.listeners.forEach((listener) => listener())
    }

    subscribe(listener: Listener): Unsubscribe {
        this.listeners.add(listener)
        return () => {
            this.listeners.delete(listener)
        }
    }
}

export const logoutEvents = new LogoutEventEmitter()
