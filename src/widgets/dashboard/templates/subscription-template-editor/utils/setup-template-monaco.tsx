import { GetAllHostsCommand } from '@remnawave/backend-contract'
import { configureMonacoYaml } from 'monaco-yaml'
import { Monaco } from '@monaco-editor/react'
import consola from 'consola'

type Host = GetAllHostsCommand.Response['response'][number]

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
                                        hostUuids: {
                                            type: 'array',
                                            items: {
                                                type: 'string',
                                                enum: hosts.map((h) => h.uuid),
                                                markdownEnumDescriptions:
                                                    hosts.map(buildMarkdownDescription),
                                                errorMessage: 'No host found with this UUID'
                                            }
                                        },
                                        tagPrefix: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
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
