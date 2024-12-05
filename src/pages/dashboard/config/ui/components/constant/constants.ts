import { IBreadcrumb } from '@shared/interfaces'
import { ROUTES } from '@shared/constants'

export const BREADCRUMBS: IBreadcrumb[] = [
    { label: 'Dashboard', href: ROUTES.DASHBOARD.HOME },
    { label: 'Config', href: ROUTES.DASHBOARD.CONFIG }
]
