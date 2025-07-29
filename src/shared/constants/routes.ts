export const ROUTES = {
    AUTH: {
        ROOT: '/auth',
        LOGIN: '/auth/login'
    },
    OAUTH2: {
        ROOT: '/oauth2/callback/:provider'
    },
    DASHBOARD: {
        ROOT: '/dashboard',
        HOME: '/dashboard/home',
        MANAGEMENT: {
            ROOT: '/dashboard/management',
            USERS: '/dashboard/management/users',
            HOSTS: '/dashboard/management/hosts',
            NODES: '/dashboard/management/nodes',
            NODES_BANDWIDTH_TABLE: '/dashboard/management/bandwidth-table',
            NODES_STATS: '/dashboard/management/stats/nodes',
            NODES_METRICS: '/dashboard/management/metrics/nodes',
            API_TOKENS: '/dashboard/management/api-tokens',
            SUBSCRIPTION_SETTINGS: '/dashboard/management/subscription-settings',
            CONFIG_PROFILES: '/dashboard/management/config-profiles',
            CONFIG_PROFILE_BY_UUID: '/dashboard/management/config-profiles/:uuid',
            INTERNAL_SQUADS: '/dashboard/management/internal-squads'
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
        },
        CRM: {
            ROOT: '/dashboard/crm',
            INFRA_BILLING: '/dashboard/crm/infra-billing'
        },
        EASTER_EGG: {
            PROXY_DEFENSE: '/dashboard/proxy-defense'
        }
    }
} as const
