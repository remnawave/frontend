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
            RESPONSE_RULES: '/dashboard/management/response-rules',
            CONFIG_PROFILES: '/dashboard/management/config-profiles',
            CONFIG_PROFILE_BY_UUID: '/dashboard/management/config-profiles/:uuid',
            INTERNAL_SQUADS: '/dashboard/management/internal-squads',
            EXTERNAL_SQUADS: '/dashboard/management/external-squads'
        },
        TOOLS: {
            ROOT: '/dashboard/tools',
            HWID_INSPECTOR: '/dashboard/tools/hwid-inspector',
            SRH_INSPECTOR: '/dashboard/tools/srh-inspector'
        },
        TEMPLATES: {
            ROOT: '/dashboard/templates',
            TEMPLATES_BY_TYPE: '/dashboard/templates/:type',
            TEMPLATE_EDITOR: '/dashboard/templates/:type/:uuid'
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
