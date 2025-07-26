import { ElementType } from 'react'

export interface MenuItem {
    header?: string
    section: {
        dropdownItems?: {
            href: string
            icon?: ElementType
            name: string
        }[]
        href: string
        icon: ElementType
        name: string
        newTab?: boolean
    }[]
}
