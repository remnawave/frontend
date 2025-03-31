export const ROUTES = {
    AUTH: {
        ROOT: '/auth',
        LOGIN: '/auth/login'
    },
    DASHBOARD: {
        ROOT: '/dashboard',
        HOME: '/dashboard/home',
        MANAGEMENT: {
            ROOT: '/dashboard/management',
            USERS: '/dashboard/management/users',
            HOSTS: '/dashboard/management/hosts',
            INBOUNDS: '/dashboard/management/inbounds',
            NODES: '/dashboard/management/nodes',
            NODES_BANDWIDTH_TABLE: '/dashboard/management/bandwidth-table',
            CONFIG: '/dashboard/management/config',
            NODES_STATS: '/dashboard/management/stats/nodes',
            API_TOKENS: '/dashboard/management/api-tokens',
            SUBSCRIPTION_SETTINGS: '/dashboard/management/subscription-settings'
        },
        TEMPLATES: {
            ROOT: '/dashboard/templates',
            XRAY_JSON: '/dashboard/templates/xray-json',
            MIHOMO: '/dashboard/templates/mihomo',
            SINGBOX_LEGACY: '/dashboard/templates/sg-legacy',
            SINGBOX: '/dashboard/templates/singbox',
            STASH: '/dashboard/templates/stash',
            CLASH: '/dashboard/templates/clash'
        },
        UTILS: {
            ROOT: '/dashboard/utils',
            HAPP_ROUTING_BUILDER: '/dashboard/utils/happ-routing-builder',
            SUBSCRIPTION_PAGE_BUILDER: '/dashboard/utils/subscription-page-builder'
        }
    }
} as const
