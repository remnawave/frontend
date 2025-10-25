import { ReactNode } from 'react'

interface SettingsCardContentProps {
    children: ReactNode
}

export function SettingsCardContent({ children }: SettingsCardContentProps) {
    return <>{children}</>
}
