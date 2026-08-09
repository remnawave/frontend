import { z } from 'zod'

/**
 * Contract for the ACME endpoints.
 *
 * It lives here instead of in @remnawave/backend-contract because the panel
 * fork adds these endpoints and the published package does not know about them.
 * Keep it in sync with libs/contract/{models,commands}/acme in the backend fork;
 * when the feature goes upstream, this file is deleted and the package takes
 * over.
 */

const ROOT = '/api/acme'

export const ACME_PROVIDER = {
    CLOUDFLARE: 'CLOUDFLARE',
    CUSTOM: 'CUSTOM',
    DESEC: 'DESEC',
    DIGITALOCEAN: 'DIGITALOCEAN',
    GANDI: 'GANDI',
    HETZNER: 'HETZNER',
    MANUAL: 'MANUAL',
    PORKBUN: 'PORKBUN',
    POWERDNS: 'POWERDNS',
    VULTR: 'VULTR'
} as const

export type TAcmeProvider = (typeof ACME_PROVIDER)[keyof typeof ACME_PROVIDER]

export const ACME_PROVIDER_VALUES = Object.values(ACME_PROVIDER) as [
    TAcmeProvider,
    ...TAcmeProvider[]
]

export interface IAcmeProviderField {
    description?: string
    key: string
    label: string
    placeholder?: string
    required: boolean
    secret: boolean
}

export interface IAcmeProviderInfo {
    description?: string
    fields: IAcmeProviderField[]
    label: string
    provider: TAcmeProvider
}

/** Mirrors ACME_PROVIDER_REGISTRY in the backend fork - keep in sync. */
export const ACME_PROVIDER_REGISTRY: IAcmeProviderInfo[] = [
    {
        fields: [
            {
                description: 'Needs Zone:Read and DNS:Edit',
                key: 'apiToken',
                label: 'API token',
                placeholder: 'Cloudflare API token',
                required: true,
                secret: true
            }
        ],
        label: 'Cloudflare',
        provider: ACME_PROVIDER.CLOUDFLARE
    },
    {
        fields: [
            {
                key: 'apiToken',
                label: 'API token',
                placeholder: 'deSEC token',
                required: true,
                secret: true
            }
        ],
        label: 'deSEC',
        provider: ACME_PROVIDER.DESEC
    },
    {
        fields: [
            {
                description: 'Needs domain read and write',
                key: 'apiToken',
                label: 'API token',
                placeholder: 'DigitalOcean personal access token',
                required: true,
                secret: true
            }
        ],
        label: 'DigitalOcean',
        provider: ACME_PROVIDER.DIGITALOCEAN
    },
    {
        fields: [
            {
                description: 'Needs "Manage domain name technical configurations"',
                key: 'apiToken',
                label: 'Personal access token',
                placeholder: 'Gandi PAT',
                required: true,
                secret: true
            }
        ],
        label: 'Gandi LiveDNS',
        provider: ACME_PROVIDER.GANDI
    },
    {
        fields: [
            {
                key: 'apiToken',
                label: 'API token',
                placeholder: 'dns.hetzner.com API token',
                required: true,
                secret: true
            }
        ],
        label: 'Hetzner DNS',
        provider: ACME_PROVIDER.HETZNER
    },
    {
        fields: [
            { key: 'apiKey', label: 'API key', placeholder: 'pk1_…', required: true, secret: true },
            {
                key: 'secretApiKey',
                label: 'Secret API key',
                placeholder: 'sk1_…',
                required: true,
                secret: true
            }
        ],
        label: 'Porkbun',
        provider: ACME_PROVIDER.PORKBUN
    },
    {
        fields: [
            {
                key: 'baseUrl',
                label: 'API URL',
                placeholder: 'http://powerdns:8081',
                required: true,
                secret: false
            },
            { key: 'apiKey', label: 'API key', required: true, secret: true },
            {
                description: 'Leave empty for the default server',
                key: 'serverId',
                label: 'Server ID',
                placeholder: 'localhost',
                required: false,
                secret: false
            }
        ],
        label: 'PowerDNS',
        provider: ACME_PROVIDER.POWERDNS
    },
    {
        fields: [
            {
                key: 'apiToken',
                label: 'API key',
                placeholder: 'Vultr API key',
                required: true,
                secret: true
            }
        ],
        label: 'Vultr',
        provider: ACME_PROVIDER.VULTR
    },
    {
        description:
            'A DNS broker speaking the simple HTTP protocol from the documentation. Keeps the real DNS credential outside the panel.',
        fields: [
            {
                key: 'baseUrl',
                label: 'URL',
                placeholder: 'http://dns-broker:8080',
                required: true,
                secret: false
            },
            {
                key: 'token',
                label: 'Token',
                placeholder: 'Client token',
                required: true,
                secret: true
            }
        ],
        label: 'Custom (HTTP API)',
        provider: ACME_PROVIDER.CUSTOM
    },
    {
        description:
            'Nothing is published automatically. Pairs with dns-persist-01, where one record is added by hand; it cannot answer dns-01.',
        fields: [],
        label: 'Manual',
        provider: ACME_PROVIDER.MANUAL
    }
]

export const ACME_CHALLENGE_TYPE = {
    DNS_01: 'DNS_01',
    DNS_PERSIST_01: 'DNS_PERSIST_01'
} as const

export type TAcmeChallengeType = (typeof ACME_CHALLENGE_TYPE)[keyof typeof ACME_CHALLENGE_TYPE]

export const ACME_KEY_TYPES = ['ECDSA_P256', 'ECDSA_P384', 'RSA_2048', 'RSA_4096'] as const

export const ACME_CERTIFICATE_SOURCE = {
    ACME: 'ACME',
    IMPORTED: 'IMPORTED'
} as const

export type TAcmeCertificateSource =
    (typeof ACME_CERTIFICATE_SOURCE)[keyof typeof ACME_CERTIFICATE_SOURCE]

export const ACME_CERTIFICATE_STATUS = {
    ACTIVE: 'ACTIVE',
    AWAITING_DNS: 'AWAITING_DNS',
    ERROR: 'ERROR',
    ISSUING: 'ISSUING',
    PENDING: 'PENDING'
} as const

export type TAcmeCertificateStatus =
    (typeof ACME_CERTIFICATE_STATUS)[keyof typeof ACME_CERTIFICATE_STATUS]

export const ACME_DIRECTORY = {
    BUYPASS: 'https://api.buypass.com/acme/directory',
    BUYPASS_STAGING: 'https://api.test4.buypass.no/acme/directory',
    GOOGLE: 'https://dv.acme-v02.api.pki.goog/directory',
    GOOGLE_STAGING: 'https://dv.acme-v02.test-api.pki.goog/directory',
    LETSENCRYPT: 'https://acme-v02.api.letsencrypt.org/directory',
    LETSENCRYPT_STAGING: 'https://acme-staging-v02.api.letsencrypt.org/directory',
    ZEROSSL: 'https://acme.zerossl.com/v2/DV90'
} as const

/**
 * Presets offered in the certificate form. Staging endpoints are first-class
 * here: they are where a new name should be rehearsed, and — until Let's Encrypt
 * enables dns-persist-01 in production — the only place that challenge works.
 */
export const ACME_DIRECTORY_PRESETS = [
    { isStaging: true, name: "Let's Encrypt (staging)", url: ACME_DIRECTORY.LETSENCRYPT_STAGING },
    { isStaging: false, name: "Let's Encrypt", url: ACME_DIRECTORY.LETSENCRYPT },
    { isStaging: true, name: 'Buypass Go (staging)', url: ACME_DIRECTORY.BUYPASS_STAGING },
    { isStaging: false, name: 'Buypass Go', url: ACME_DIRECTORY.BUYPASS },
    {
        isStaging: true,
        name: 'Google Trust Services (staging)',
        url: ACME_DIRECTORY.GOOGLE_STAGING
    },
    { isStaging: false, name: 'Google Trust Services', url: ACME_DIRECTORY.GOOGLE },
    { isStaging: false, name: 'ZeroSSL', url: ACME_DIRECTORY.ZEROSSL }
] as const

const dateFromString = z.iso.datetime().transform((value) => new Date(value))

export const AcmeCredentialSchema = z.object({
    certificatesCount: z.number().int(),
    config: z.record(z.string(), z.string()),
    createdAt: dateFromString,
    hasSecret: z.boolean(),
    name: z.string(),
    provider: z.enum(ACME_PROVIDER_VALUES),
    updatedAt: dateFromString,
    uuid: z.uuid()
})

export const AcmeCertificateNodeSchema = z.object({
    inboundTags: z.array(z.string()),
    nodeName: z.nullable(z.string()),
    nodeUuid: z.uuid()
})

export const AcmeCertificateSchema = z.object({
    challengeType: z.enum([ACME_CHALLENGE_TYPE.DNS_01, ACME_CHALLENGE_TYPE.DNS_PERSIST_01]),
    createdAt: dateFromString,
    credentialName: z.nullable(z.string()),
    credentialUuid: z.nullable(z.uuid()),
    directoryUrl: z.nullable(z.string()),
    domains: z.array(z.string()),
    eabKid: z.nullable(z.string()),
    email: z.nullable(z.string()),
    expiresAt: z.nullable(dateFromString),
    failCount: z.number().int(),
    fingerprint: z.nullable(z.string()),
    isEnabled: z.boolean(),
    issuedAt: z.nullable(dateFromString),
    keyType: z.enum(ACME_KEY_TYPES),
    lastError: z.nullable(z.string()),
    name: z.string(),
    nextRetryAt: z.nullable(dateFromString),
    nodes: z.array(AcmeCertificateNodeSchema),
    renewBeforeDays: z.number().int(),
    source: z.enum([ACME_CERTIFICATE_SOURCE.ACME, ACME_CERTIFICATE_SOURCE.IMPORTED]),
    status: z.enum([
        ACME_CERTIFICATE_STATUS.PENDING,
        ACME_CERTIFICATE_STATUS.AWAITING_DNS,
        ACME_CERTIFICATE_STATUS.ISSUING,
        ACME_CERTIFICATE_STATUS.ACTIVE,
        ACME_CERTIFICATE_STATUS.ERROR
    ]),
    updatedAt: dateFromString,
    uuid: z.uuid()
})

export const AcmeEventSchema = z.object({
    certificateUuid: z.nullable(z.uuid()),
    createdAt: dateFromString,
    id: z.number().int(),
    level: z.enum(['INFO', 'ERROR']),
    message: z.string()
})

export const AcmePersistRecordSchema = z.object({
    canPublish: z.boolean(),
    isPublished: z.boolean(),
    name: z.string(),
    value: z.string()
})

export const AcmeCredentialTestSchema = z.object({
    allow: z.array(z.string()),
    isOk: z.boolean(),
    message: z.string(),
    zones: z.array(z.string())
})

const uuidParam = z.object({ uuid: z.uuid() })

export namespace GetAcmeCredentialsCommand {
    export const TSQ_url = `${ROOT}/credentials`

    export const ResponseSchema = z.object({
        response: z.object({
            credentials: z.array(AcmeCredentialSchema),
            total: z.number()
        })
    })

    export type Response = z.infer<typeof ResponseSchema>
}

export namespace CreateAcmeCredentialCommand {
    export const TSQ_url = `${ROOT}/credentials`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestBodySchema = z.object({
        config: z.optional(z.record(z.string(), z.string())),
        name: z.string().min(2).max(40),
        provider: z.enum(ACME_PROVIDER_VALUES)
    })

    export const ResponseSchema = z.object({ response: AcmeCredentialSchema })

    export type RequestBody = z.infer<typeof RequestBodySchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace UpdateAcmeCredentialCommand {
    export const TSQ_url = `${ROOT}/credentials`
    export const endpointDetails = { REQUEST_METHOD: 'patch' } as const

    export const RequestBodySchema = z.object({
        config: z.optional(z.record(z.string(), z.string())),
        name: z.optional(z.string().min(2).max(40)),
        uuid: z.uuid()
    })

    export const ResponseSchema = z.object({ response: AcmeCredentialSchema })

    export type RequestBody = z.infer<typeof RequestBodySchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace DeleteAcmeCredentialCommand {
    export const TSQ_url = `${ROOT}/credentials/:uuid`
    export const endpointDetails = { REQUEST_METHOD: 'delete' } as const

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({
        response: z.object({ isDeleted: z.boolean() })
    })

    export type Response = z.infer<typeof ResponseSchema>
}

export namespace TestAcmeCredentialCommand {
    export const TSQ_url = `${ROOT}/credentials/:uuid/test`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({ response: AcmeCredentialTestSchema })

    export type Response = z.infer<typeof ResponseSchema>
}

export namespace GetAcmeCertificatesCommand {
    export const TSQ_url = `${ROOT}/certificates`

    export const ResponseSchema = z.object({
        response: z.object({
            certificates: z.array(AcmeCertificateSchema),
            total: z.number()
        })
    })

    export type Response = z.infer<typeof ResponseSchema>
}

export namespace CreateAcmeCertificateCommand {
    export const TSQ_url = `${ROOT}/certificates`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestBodySchema = z.object({
        challengeType: z.optional(
            z.enum([ACME_CHALLENGE_TYPE.DNS_01, ACME_CHALLENGE_TYPE.DNS_PERSIST_01])
        ),
        credentialUuid: z.uuid(),
        directoryUrl: z.optional(z.url()),
        domains: z.array(z.string()).min(1),
        eabHmacKey: z.optional(z.string().min(1)),
        eabKid: z.optional(z.string().min(1)),
        email: z.email(),
        isEnabled: z.optional(z.boolean()),
        keyType: z.optional(z.enum(ACME_KEY_TYPES)),
        name: z.string().min(2).max(40),
        nodes: z.optional(
            z.array(
                z.object({
                    inboundTags: z.array(z.string()),
                    nodeUuid: z.uuid()
                })
            )
        ),
        renewBeforeDays: z.optional(z.number().int().min(1).max(85))
    })

    export const ResponseSchema = z.object({ response: AcmeCertificateSchema })

    export type RequestBody = z.infer<typeof RequestBodySchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace UpdateAcmeCertificateCommand {
    export const TSQ_url = `${ROOT}/certificates`
    export const endpointDetails = { REQUEST_METHOD: 'patch' } as const

    export const RequestBodySchema =
        CreateAcmeCertificateCommand.RequestBodySchema.partial().extend({
            uuid: z.uuid()
        })

    export const ResponseSchema = z.object({ response: AcmeCertificateSchema })

    export type RequestBody = z.infer<typeof RequestBodySchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace DeleteAcmeCertificateCommand {
    export const TSQ_url = `${ROOT}/certificates/:uuid`
    export const endpointDetails = { REQUEST_METHOD: 'delete' } as const

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({
        response: z.object({ isDeleted: z.boolean() })
    })

    export type Response = z.infer<typeof ResponseSchema>
}

export namespace IssueAcmeCertificateCommand {
    export const TSQ_url = `${ROOT}/certificates/:uuid/issue`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({
        response: z.object({ isQueued: z.boolean() })
    })

    export type Response = z.infer<typeof ResponseSchema>
}

/**
 * PEM as text on both sides: a file picked in the browser is read into the same
 * field, so uploading a file and pasting a certificate hit one endpoint.
 */
const pemMaterial = {
    fullchainPem: z.string().min(1),
    privateKeyPem: z.string().min(1)
}

export namespace ImportAcmeCertificateCommand {
    export const TSQ_url = `${ROOT}/certificates/import`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestBodySchema = z.object({
        ...pemMaterial,
        isEnabled: z.optional(z.boolean()),
        name: z.string().min(2).max(40),
        nodes: z.optional(
            z.array(
                z.object({
                    inboundTags: z.array(z.string()),
                    nodeUuid: z.uuid()
                })
            )
        )
    })

    export const ResponseSchema = z.object({ response: AcmeCertificateSchema })

    export type RequestBody = z.infer<typeof RequestBodySchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace ReimportAcmeCertificateCommand {
    export const TSQ_url = `${ROOT}/certificates/:uuid/import`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestParamSchema = uuidParam
    export const RequestBodySchema = z.object(pemMaterial)
    export const ResponseSchema = z.object({ response: AcmeCertificateSchema })

    export type RequestBody = z.infer<typeof RequestBodySchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace GetAcmeCertificateEventsCommand {
    export const TSQ_url = `${ROOT}/certificates/:uuid/events`

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({
        response: z.object({
            events: z.array(AcmeEventSchema),
            total: z.number()
        })
    })

    export type RequestParam = z.infer<typeof RequestParamSchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace GetAcmePersistRecordCommand {
    export const TSQ_url = `${ROOT}/certificates/:uuid/persist-record`

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({ response: AcmePersistRecordSchema })

    export type RequestParam = z.infer<typeof RequestParamSchema>
    export type Response = z.infer<typeof ResponseSchema>
}

export namespace PublishAcmePersistRecordCommand {
    export const TSQ_url = `${ROOT}/certificates/:uuid/persist-record/publish`
    export const endpointDetails = { REQUEST_METHOD: 'post' } as const

    export const RequestParamSchema = uuidParam
    export const ResponseSchema = z.object({ response: AcmePersistRecordSchema })

    export type Response = z.infer<typeof ResponseSchema>
}
