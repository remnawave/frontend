import { IBreadcrumb, ROUTES } from '@shared/constants'

export const BREADCRUMBS: IBreadcrumb[] = [
    { label: 'Dashboard', href: ROUTES.DASHBOARD.HOME },
    { label: 'Hosts', href: ROUTES.DASHBOARD.HOSTS }
]
