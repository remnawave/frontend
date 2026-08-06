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

const injectSnippetProperty = (node: ISchemaNode | undefined, snippetSchema: object): number => {
    if (!node || typeof node !== 'object') {
        return 0
    }

    let injected = 0

    if (node.properties) {
        node.properties.snippet = snippetSchema
        injected += 1
    }

    for (const branch of [...(node.anyOf ?? []), ...(node.oneOf ?? []), ...(node.allOf ?? [])]) {
        injected += injectSnippetProperty(branch, snippetSchema)
    }

    return injected
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

            const notInjected = (
                ['OutboundObject', 'RuleObject', 'BalancerObject'] as const
            ).filter(
                (definition) =>
                    injectSnippetProperty(schema.definitions?.[definition], snippetSchema) === 0
            )

            if (notInjected.length > 0) {
                consola.error(
                    `Failed to inject the snippet property into the Xray schema: ${notInjected.join(', ')}.`
                )
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

            const snippetArraySchema = {
                $schema: 'http://json-schema.org/draft-07/schema#',
                title: 'Snippet Array',
                description: 'Array of Outbound, Rule or Balancer objects for snippets',
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
                        }
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
