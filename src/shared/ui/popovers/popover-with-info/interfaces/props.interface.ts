import { ReactNode } from 'react'

export interface IProps {
    position?: 'bottom' | 'left' | 'right' | 'top'
    text: ReactNode
}
