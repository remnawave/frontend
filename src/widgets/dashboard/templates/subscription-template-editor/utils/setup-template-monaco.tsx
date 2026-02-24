import { GetAllHostsCommand } from '@remnawave/backend-contract'
import { configureMonacoYaml } from 'monaco-yaml'
import { Monaco } from '@monaco-editor/react'
import consola from 'consola'

type Host = GetAllHostsCommand.Response['response'][number]

const DOCS_URL = 'https://docs.rw/docs/learn/xray-json-advanced'
const DOCS_LINK = `\n\n[📖 Documentation](${DOCS_URL})`

function getHostStatus(host: Host): { icon: string; label: string } {
    if (host.isDisabled) return { icon: '⛔', label: 'Disabled' }
    if (host.isHidden) return { icon: '👁', label: 'Hidden' }
    return { icon: '✅', label: 'Active' }
}

function buildMarkdownDescription(host: Host): string {
    const { icon, label } = getHostStatus(host)

    const rows: string[] = [
        '',
        '| | |',
        '|:--|:--|',
        `| **Remark** | **${host.remark}** |`,
        `| **Address** | \`${host.address}:${host.port}\` |`,
        `| **Status** | ${icon} ${label} |`
    ]

    if (host.tag) rows.push(`| **Tag** | \`${host.tag}\` |`)
    if (host.sni) rows.push(`| **SNI** | \`${host.sni}\` |`)
    if (host.serverDescription) rows.push(`| **Description** | ${host.serverDescription} |`)
    if (host.inbound.configProfileUuid) {
        rows.push(`| **Profile UUID** | \`${host.inbound.configProfileUuid}\` |`)
    }
    if (host.inbound.configProfileInboundUuid) {
        rows.push(`| **Inbound UUID** | \`${host.inbound.configProfileInboundUuid}\` |`)
    }

    return rows.join('\n')
}

export const configureMonaco = (
    monaco: Monaco,
    language: 'json' | 'yaml',
    hosts: GetAllHostsCommand.Response['response']
) => {
    try {
        if (language === 'yaml') {
            configureMonacoYaml(monaco, {
                validate: true,
                enableSchemaRequest: true,
                hover: true,
                completion: true,
                format: true
            })
        }

        if (language === 'json') {
            const hostUuids = hosts.map((h) => h.uuid)
            const hostDescriptions = hosts.map(buildMarkdownDescription)

            const schema = {
                type: 'object',
                properties: {
                    remnawave: {
                        type: 'object',
                        properties: {
                            injectHosts: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        selector: {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    enum: [
                                                        'uuids',
                                                        'remarkRegex',
                                                        'tagRegex',
                                                        'sameTagAsRecipient'
                                                    ]
                                                }
                                            },
                                            required: ['type'],
                                            allOf: [
                                                {
                                                    if: {
                                                        properties: {
                                                            type: { const: 'uuids' }
                                                        },
                                                        required: ['type']
                                                    },
                                                    then: {
                                                        properties: {
                                                            type: true,
                                                            values: {
                                                                type: 'array',
                                                                items: {
                                                                    type: 'string',
                                                                    format: 'uuid',
                                                                    enum: hostUuids,
                                                                    markdownEnumDescriptions:
                                                                        hostDescriptions,
                                                                    errorMessage:
                                                                        'No host found with this UUID'
                                                                },
                                                                minItems: 1
                                                            }
                                                        },
                                                        required: ['values'],
                                                        additionalProperties: false
                                                    }
                                                },
                                                {
                                                    if: {
                                                        properties: {
                                                            type: { const: 'remarkRegex' }
                                                        },
                                                        required: ['type']
                                                    },
                                                    then: {
                                                        properties: {
                                                            type: true,
                                                            pattern: {
                                                                type: 'string',
                                                                minLength: 1
                                                            }
                                                        },
                                                        required: ['pattern'],
                                                        additionalProperties: false
                                                    }
                                                },
                                                {
                                                    if: {
                                                        properties: {
                                                            type: { const: 'tagRegex' }
                                                        },
                                                        required: ['type']
                                                    },
                                                    then: {
                                                        properties: {
                                                            type: true,
                                                            pattern: {
                                                                type: 'string',
                                                                minLength: 1
                                                            }
                                                        },
                                                        required: ['pattern'],
                                                        additionalProperties: false
                                                    }
                                                },
                                                {
                                                    if: {
                                                        properties: {
                                                            type: {
                                                                const: 'sameTagAsRecipient'
                                                            }
                                                        },
                                                        required: ['type']
                                                    },
                                                    then: {
                                                        properties: { type: true },
                                                        additionalProperties: false
                                                    }
                                                }
                                            ]
                                        },
                                        selectFrom: {
                                            type: 'string',
                                            enum: ['ALL', 'HIDDEN', 'NOT_HIDDEN'],
                                            default: 'HIDDEN',
                                            markdownDescription: `Filter hosts by visibility. Defaults to HIDDEN if not specified. ${DOCS_LINK}`
                                        },
                                        tagPrefix: {
                                            type: 'string',
                                            minLength: 1
                                        },
                                        useHostRemarkAsTag: {
                                            type: 'boolean',
                                            markdownDescription: `Use host remark as tag. ${DOCS_LINK}`
                                        },
                                        useHostTagAsTag: {
                                            type: 'boolean',
                                            markdownDescription: `Use host tag as tag. ${DOCS_LINK}`
                                        }
                                    },
                                    required: ['selector'],
                                    anyOf: [
                                        { required: ['tagPrefix'] },
                                        {
                                            properties: {
                                                useHostRemarkAsTag: {
                                                    const: true
                                                }
                                            },
                                            required: ['useHostRemarkAsTag']
                                        },
                                        {
                                            properties: {
                                                useHostTagAsTag: {
                                                    const: true
                                                }
                                            },
                                            required: ['useHostTagAsTag']
                                        }
                                    ],
                                    additionalProperties: false
                                },
                                markdownDescription: `Inject hosts into the subscription template. ${DOCS_LINK}`
                            }
                        },
                        additionalProperties: false
                    }
                }
            }

            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: false,
                enableSchemaRequest: true,
                schemaRequest: 'warning',
                schemas: [
                    {
                        fileMatch: ['*'],
                        schema,
                        uri: 'https://subscription-template-schema.json'
                    }
                ],
                validate: true
            })
        }
    } catch (error) {
        consola.error(`Failed to configure Monaco ${language.toUpperCase()}:`, error)
    }
}
