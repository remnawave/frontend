export const ROUTES = {
    AUTH: {
        ROOT: '/auth',
        LOGIN: '/auth/login'
    },
    DASHBOARD: {
        ROOT: '/dashboard',
        HOME: '/dashboard/home',
        USERS: '/dashboard/users',
        HOSTS: '/dashboard/hosts',
        NODES: '/dashboard/nodes',
        CONFIG: '/dashboard/config'
    }
} as const
