import { ROUTES } from '@/shared/constants'
import { IBreadcrumb } from '@/shared/interfaces'

export const BREADCRUMBS: IBreadcrumb[] = [
    { label: 'Dashboard', href: ROUTES.DASHBOARD.HOME },
    { label: 'Hosts', href: ROUTES.DASHBOARD.HOSTS }
]
