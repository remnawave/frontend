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
        INBOUNDS: '/dashboard/inbounds',
        NODES: '/dashboard/nodes',
        NODES_BANDWIDTH_TABLE: '/dashboard/bandwidth-table',
        CONFIG: '/dashboard/config',
        NODES_STATS: '/dashboard/stats/nodes',
        API_TOKENS: '/dashboard/api-tokens',
        TEMPLATES: {
            ROOT: '/dashboard/templates',
            XRAY_JSON: '/dashboard/templates/xray-json',
            MIHOMO: '/dashboard/templates/mihomo',
            SINGBOX_LEGACY: '/dashboard/templates/sg-legacy',
            SINGBOX: '/dashboard/templates/singbox',
            STASH: '/dashboard/templates/stash',
            CLASH: '/dashboard/templates/clash'
        },
        SUBSCRIPTION_SETTINGS: '/dashboard/subscription-settings',
        UTILS: {
            HAPP_ROUTING_BUILDER: '/dashboard/utils/happ-routing-builder'
        }
    }
} as const
