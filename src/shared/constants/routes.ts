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
        OPEN_ENTITY: '/dashboard/open/:entity/:id',
        MANAGEMENT: {
            ROOT: '/dashboard/management',
            USERS: '/dashboard/management/users',
            HOSTS: '/dashboard/management/hosts',
            NODES: '/dashboard/management/nodes',
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
            SRH_INSPECTOR: '/dashboard/tools/srh-inspector',
            TORRENT_BLOCKER_REPORTS: '/dashboard/tools/torrent-blocker-reports',
            SESSIONS_EXPLORER: '/dashboard/tools/sessions-explorer',
            HTTP_STATS: '/dashboard/tools/http-stats',
            QUICK_OPEN: '/dashboard/tools/quick-open'
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

export const OPEN_ENTITY = {
    CONFIG_PROFILE: 'config-profile',
    EXTERNAL_SQUAD: 'external-squad',
    INTERNAL_SQUAD: 'internal-squad',
    NODE: 'node',
    NODE_PLUGIN: 'node-plugin',
    SUBPAGE_CONFIG: 'subpage-config',
    USER: 'user'
} as const

export type TOpenEntity = (typeof OPEN_ENTITY)[keyof typeof OPEN_ENTITY]

export const buildOpenEntityUrl = (entity: TOpenEntity, id: number | string) =>
    `${window.location.origin}${ROUTES.DASHBOARD.OPEN_ENTITY.replace(':entity', entity).replace(':id', String(id))}`
