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
            SUBSCRIPTION_SETTINGS: '/dashboard/management/subscription-settings',
            RESPONSE_RULES: '/dashboard/management/response-rules',
            CONFIG_PROFILES: '/dashboard/management/config-profiles',
            CONFIG_PROFILE_BY_UUID: '/dashboard/management/config-profiles/:uuid',
            INTERNAL_SQUADS: '/dashboard/management/internal-squads',
            EXTERNAL_SQUADS: '/dashboard/management/external-squads',
            REMNAWAVE_SETTINGS: '/dashboard/management/settings',
            NODE_PLUGINS: {
                ROOT: '/dashboard/management/plugins',
                NODE_PLUGIN_BY_UUID: '/dashboard/management/plugins/:uuid'
            }
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
        SUBPAGE_CONFIGS: {
            ROOT: '/dashboard/subpage',
            SUBPAGE_CONFIG_BY_UUID: '/dashboard/subpage/:uuid'
        },
        CRM: {
            ROOT: '/dashboard/crm',
            INFRA_BILLING: '/dashboard/crm/infra-billing'
        }
    }
} as const
