import { ElementType } from 'react'

export interface MenuItem {
    header: string
    section: {
        dropdownItems?: {
            badge?: string
            href: string
            name: string
        }[]
        href: string
        icon: ElementType
        name: string
    }[]
}
