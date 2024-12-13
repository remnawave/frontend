import { IBreadcrumb, ROUTES } from '@shared/constants'

export const BREADCRUMBS: IBreadcrumb[] = [
    { label: 'Dashboard', href: ROUTES.DASHBOARD.HOME },
    { label: 'Nodes', href: ROUTES.DASHBOARD.NODES },
    { label: 'Bandwidth table', href: ROUTES.DASHBOARD.NODES_BANDWIDTH_TABLE }
]
