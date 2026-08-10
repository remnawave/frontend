import { Monaco } from '@monaco-editor/react'
import {
    GetSnippetsCommand,
    ResponseRulesConfigSchema,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { NodePluginSchema } from '@remnawave/node-plugins'
import axios from 'axios'
import consola from 'consola'
import { app } from 'src/config'

import { monacoTheme } from '@shared/constants/monaco-theme'

interface ISchemaNode {
    allOf?: ISchemaNode[]
    anyOf?: ISchemaNode[]
    oneOf?: ISchemaNode[]
    properties?: Record<string, unknown>
}

interface IXraySchema {
    $ref?: unknown
    definitions?: Record<string, ISchemaNode | undefined>
}

const DEFINITIONS_REF_PREFIX = '#/definitions/'
const PROTECTED_ROOT_KEYS = new Set(['api', 'inbounds', 'metrics', 'snippets', 'stats'])

const CUSTOM_CORE_SCHEMA = {
    title: 'Remnawave Custom Core',
    markdownDescription: [
        '**Remnawave custom field.** Not part of Xray-Core – it is handled by the Remnawave Node.',
        '',
        '> ⚠️ **Beta feature. Use strictly at your own risk.**',
        '>',
        '> It may be changed or removed at any time without prior notice.',
        '',
        'Replaces the Xray-Core binary on every node running this config profile with the one downloaded from `url`.',
        '',
        'The node verifies the `sha256` checksum before installing anything, keeps the bundled core untouched, and rolls back to it as soon as this section is removed.',
        '',
        '```json',
        '{',
        '  "geodata": {',
        '    "core": {',
        '      "url": "https://example.com/xray-linux-amd64",',
        '      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"',
        '    }',
        '  }',
        '}',
        '```'
    ].join('\n'),
    type: 'object',
    additionalProperties: false,
    required: ['url', 'sha256'],
    properties: {
        url: {
            title: 'Core URL',
            markdownDescription: [
                'Direct link to the Xray-Core binary to install on the node.',
                '',
                '> Only `https` is accepted. The file is downloaded on every node that runs this config profile.'
            ].join('\n'),
            type: 'string',
            pattern: '^https://\\S+$',
            patternErrorMessage: 'URL must start with https:// '
        },
        sha256: {
            title: 'Core SHA-256',
            markdownDescription: [
                'SHA-256 checksum of the binary, 64 hexadecimal characters.',
                '',
                '> The node refuses to install the binary if the checksum does not match, so a wrong value here leaves the currently installed core in place.'
            ].join('\n'),
            type: 'string',
            pattern: '^[A-Fa-f0-9]{64}$',
            patternErrorMessage: 'SHA-256 must be exactly 64 hexadecimal characters'
        }
    }
}

const injectProperty = (
    node: ISchemaNode | undefined,
    propertyName: string,
    propertySchema: object
): number => {
    if (!node || typeof node !== 'object') {
        return 0
    }

    let injected = 0

    if (node.properties) {
        node.properties[propertyName] = propertySchema
        injected += 1
    }

    for (const branch of [...(node.anyOf ?? []), ...(node.oneOf ?? []), ...(node.allOf ?? [])]) {
        injected += injectProperty(branch, propertyName, propertySchema)
    }

    return injected
}

const resolveRootNode = (schema: IXraySchema | undefined): ISchemaNode | undefined => {
    const ref = schema?.$ref

    if (typeof ref !== 'string' || !ref.startsWith(DEFINITIONS_REF_PREFIX)) {
        return undefined
    }

    return schema?.definitions?.[ref.slice(DEFINITIONS_REF_PREFIX.length)]
}

export const MonacoSetupFeature = {
    setup: async (
        monaco: Monaco,
        currentLanguage: string,
        snippets: GetSnippetsCommand.Response['response']['snippets']
    ) => {
        try {
            const snippetNames = snippets.map((s) => s.name)

            let { jsonSchemaUrl } = app.configEditor
            switch (currentLanguage) {
                case 'zh':
                    jsonSchemaUrl = app.configEditor.jsonSchemaCnUrl
                    break
                default:
                    jsonSchemaUrl = app.configEditor.jsonSchemaUrl
            }

            const response = await axios.get(jsonSchemaUrl)
            const schema = response.data

            const snippetDescriptions = snippets.map((snippet) => {
                const snippetJson = JSON.stringify(snippet.snippet, null, 1)

                return ['', '```json', snippetJson.slice(2, -2), '```', '', '---', ''].join('\n')
            })

            const snippetSchema = {
                name: 'snippet',
                title: 'Remnawave Snippets',
                markdownDescription:
                    'Create your own snippets to quickly configure your **Outbounds** or **Rules**. \n\n\nReference them here, Remnawave will handle the rest.',
                type: 'string',
                enum: snippetNames,
                markdownEnumDescriptions: snippetDescriptions,
                minLength: 2,
                maxLength: 255,
                pattern: '^[A-Za-z0-9_\\s-]+$',
                patternErrorMessage:
                    'Snippet name can only contain: letters, numbers, spaces, _ and -'
            }

            const rootSnippetsSchema = {
                name: 'snippets',
                title: 'Remnawave Snippets',
                markdownDescription: [
                    'Snippets merged into the **root** of this config.',
                    '',
                    'Every object of a listed snippet must hold root-level sections, for example:',
                    '```json',
                    '[{ "log": { "loglevel": "debug" } }]',
                    '```',
                    'Sections already written in this config are kept – a snippet never overwrites them.',
                    '',
                    '`inbounds`, `api`, `stats` and `metrics` are always skipped.'
                ].join('\n'),
                type: 'array',
                items: {
                    ...snippetSchema,
                    title: 'Snippet name'
                },
                minItems: 1
            }

            const notInjected: string[] = (
                ['OutboundObject', 'RuleObject', 'BalancerObject'] as const
            ).filter(
                (definition) =>
                    injectProperty(schema.definitions?.[definition], 'snippet', snippetSchema) === 0
            )

            const rootNode = resolveRootNode(schema)

            if (injectProperty(rootNode, 'snippets', rootSnippetsSchema) === 0) {
                notInjected.push('config root')
            }

            if (notInjected.length > 0) {
                consola.error(
                    `Failed to inject the snippet property into the Xray schema: ${notInjected.join(', ')}.`
                )
            }

            if (
                injectProperty(schema.definitions?.GeodataObject, 'core', CUSTOM_CORE_SCHEMA) ===
                    0 &&
                rootNode?.properties?.geodata
            ) {
                consola.error('Failed to inject the custom core property into GeodataObject.')
            }

            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: false,
                enableSchemaRequest: true,
                schemaRequest: 'warning',
                schemas: [
                    {
                        fileMatch: ['*'],
                        schema,
                        uri: 'https://xray-config-schema.json'
                    }
                ],
                validate: true
            })
        } catch (error) {
            consola.error('Failed to load JSON schema:', error)
        }
    }
}

export const MonacoSetupSnippetsFeature = {
    setup: async (monaco: Monaco, currentLanguage: string) => {
        try {
            let { jsonSchemaUrl } = app.configEditor
            switch (currentLanguage) {
                case 'zh':
                    jsonSchemaUrl = app.configEditor.jsonSchemaCnUrl
                    break
                default:
                    jsonSchemaUrl = app.configEditor.jsonSchemaUrl
            }

            const response = await axios.get(jsonSchemaUrl)
            const schema = await response.data

            const rootNode = resolveRootNode(schema)

            injectProperty(schema.definitions?.GeodataObject, 'core', CUSTOM_CORE_SCHEMA)

            const snippetArraySchema = {
                $schema: 'http://json-schema.org/draft-07/schema#',
                title: 'Snippet Array',
                description: 'Array of Root, Outbound, Rule or Balancer objects for snippets',
                type: 'array',
                items: {
                    oneOf: [
                        {
                            ...schema.definitions?.OutboundObject,
                            title: 'Outbound Object',
                            description: 'Outbound configuration (for outbounds[])'
                        },
                        {
                            ...schema.definitions?.RuleObject,
                            title: 'Rule Object',
                            description: 'Routing rule (for routing.rules[])'
                        },
                        {
                            ...schema.definitions?.BalancerObject,
                            title: 'Balancer Object',
                            description: 'Balancer configuration (for routing.balancers[])'
                        },
                        ...(rootNode?.properties
                            ? [
                                  {
                                      ...rootNode,
                                      properties: Object.fromEntries(
                                          Object.entries(rootNode.properties).filter(
                                              ([key]) => !PROTECTED_ROOT_KEYS.has(key)
                                          )
                                      ),
                                      title: 'Root Object',
                                      description:
                                          'Root-level sections (for configs referencing this snippet in the root "snippets" array)',
                                      markdownDescription:
                                          'Root-level sections, merged into the **root** of every config that lists this snippet in its root `snippets` array. \n\n\n`inbounds`, `api`, `stats` and `metrics` cannot be provided by a snippet.'
                                  }
                              ]
                            : [])
                    ]
                },
                minItems: 1,
                definitions: schema.definitions || {}
            }

            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: false,
                enableSchemaRequest: true,
                schemaRequest: 'warning',
                schemas: [
                    {
                        fileMatch: ['snippet://*'],
                        schema: snippetArraySchema,
                        uri: 'https://snippet-schema.json'
                    }
                ],
                validate: true
            })

            return snippetArraySchema
        } catch (error) {
            consola.error('Failed to load snippet JSON schema:', error)
            return null
        }
    }
}

export const MonacoSetupResponseRulesFeature = {
    setup: async (
        monaco: Monaco,
        groupedTemplates: Record<TSubscriptionTemplateType, string[]>
    ) => {
        try {
            const schema = ResponseRulesConfigSchema.toJSONSchema({
                target: 'draft-07'
            })

            const templateOptions = {
                BROWSER: [],
                BLOCK: [],
                STATUS_CODE_404: [],
                STATUS_CODE_451: [],
                SOCKET_DROP: [],
                ...groupedTemplates
            }

            const rules = schema.properties?.rules
            const rulesItems =
                typeof rules === 'object' &&
                typeof rules.items === 'object' &&
                !Array.isArray(rules.items)
                    ? rules.items
                    : undefined

            if (rulesItems) {
                const rulesAllOf = (rulesItems.allOf ??= [])

                Object.entries(templateOptions).forEach(([responseType, templates]) => {
                    if (templates.length > 0) {
                        rulesAllOf.push({
                            if: {
                                properties: {
                                    responseType: { const: responseType }
                                },
                                required: ['responseType']
                            },
                            // oxlint-disable-next-line
                            then: {
                                properties: {
                                    responseModifications: {
                                        properties: {
                                            subscriptionTemplate: {
                                                enum: templates,
                                                markdownDescription: `Available templates for **${responseType}** response type.`,
                                                markdownEnumDescriptions: templates.map(
                                                    (t) => `Use ${t} template`
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    } else {
                        rulesAllOf.push({
                            if: {
                                properties: {
                                    responseType: { const: responseType }
                                },
                                required: ['responseType']
                            },
                            // oxlint-disable-next-line
                            then: {
                                properties: {
                                    responseModifications: {
                                        properties: {
                                            subscriptionTemplate: {
                                                type: 'null',
                                                not: { type: 'string' },
                                                markdownDescription: `⚠️ No templates available for **${responseType}** response type. This field should not be used.`
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
            }

            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                schemaValidation: 'error',
                comments: 'error',
                trailingCommas: 'error',

                schemas: [
                    {
                        fileMatch: ['response-rules://*'],
                        schema,
                        uri: 'https://response-rules-schema.json'
                    }
                ],
                validate: true
            })

            monaco.languages.json.jsonDefaults.setModeConfiguration({
                documentFormattingEdits: true,
                documentRangeFormattingEdits: true,
                completionItems: true,
                hovers: true,
                documentSymbols: true,
                tokens: true,
                colors: true,
                foldingRanges: true,
                diagnostics: true,
                selectionRanges: true
            })

            monaco.editor.defineTheme('GithubDark', {
                ...monacoTheme,
                base: 'vs-dark'
            })
        } catch (error) {
            consola.error('Failed to load JSON schema:', error)
        }
    }
}

export const MonacoSetupNodePluginEditorFeature = {
    setup: async (monaco: Monaco) => {
        try {
            const schema = NodePluginSchema.toJSONSchema()

            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                schemaValidation: 'error',
                comments: 'error',
                trailingCommas: 'error',

                schemas: [
                    {
                        fileMatch: ['node-plugin://*'],
                        schema,
                        uri: 'https://node-plugin-schema.json'
                    }
                ],
                validate: true
            })

            monaco.languages.json.jsonDefaults.setModeConfiguration({
                documentFormattingEdits: true,
                documentRangeFormattingEdits: true,
                completionItems: true,
                hovers: true,
                documentSymbols: true,
                tokens: true,
                colors: true,
                foldingRanges: true,
                diagnostics: true,
                selectionRanges: true
            })

            monaco.editor.defineTheme('GithubDark', {
                ...monacoTheme,
                base: 'vs-dark'
            })
        } catch (error) {
            consola.error('Failed to load JSON schema:', error)
        }
    }
}
