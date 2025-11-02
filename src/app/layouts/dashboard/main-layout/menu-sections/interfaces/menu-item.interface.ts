import { ElementType } from 'react'

export interface MenuItem {
    header?: string
    id?: string
    section: {
        dropdownItems?: {
            href: string
            icon?: ElementType
            id: string
            name: string
        }[]
        href: string
        icon: ElementType
        id: string
        name: string
        newTab?: boolean
    }[]
}
