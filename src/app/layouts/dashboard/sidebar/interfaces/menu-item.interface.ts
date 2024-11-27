import { ElementType } from 'react';

export interface MenuItem {
    header: string;
    section: {
        name: string;
        href: string;
        icon: ElementType;
        dropdownItems?: {
            name: string;
            href: string;
            badge?: string;
        }[];
    }[];
}
