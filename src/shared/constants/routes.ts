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
        NODES_BANDWIDTH_TABLE: '/dashboard/bandwidth-table',
        CONFIG: '/dashboard/config',
        NODES_STATS: '/dashboard/stats/nodes',
        API_TOKENS: '/dashboard/api-tokens'
    }
} as const
