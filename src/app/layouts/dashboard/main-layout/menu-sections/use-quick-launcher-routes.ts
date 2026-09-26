import type { MenuItem } from './interfaces'
import type { ComponentType } from 'react'

import { useMemo } from 'react'

import type { IQuickLauncherRoute } from '@shared/ui/quick-launcher'

import { useDesktopMenuSections } from './desktop-menu-sections'

type TSectionItem = MenuItem['section'][number]

const hasIconComponent = (
    item: TSectionItem
): item is TSectionItem & { icon: ComponentType<{ size?: number }> } =>
    typeof item.icon === 'function'

export const useQuickLauncherRoutes = (): IQuickLauncherRoute[] => {
    const menuSections = useDesktopMenuSections()

    return useMemo(
        () =>
            menuSections.flatMap((group) =>
                group.section
                    .filter(hasIconComponent)
                    .map((item) => ({ href: item.href, icon: item.icon, name: item.name }))
            ),
        [menuSections]
    )
}
