import { GetSnippetsCommand } from '@remnawave/backend-contract'
import { Monaco } from '@monaco-editor/react'
import consola from 'consola'
import axios from 'axios'

import { app } from 'src/config'

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
            const schema = await response.data

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

            if (schema.definitions?.OutboundObject?.properties) {
                schema.definitions.OutboundObject.properties.snippet = snippetSchema
            }

            if (schema.definitions?.RuleObject?.properties) {
                schema.definitions.RuleObject.properties.snippet = snippetSchema
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
                description: 'Array of Outbound or Rule objects for snippets',
                type: 'array',
                items: {
                    oneOf: [
                        {
                            ...(schema.definitions?.OutboundObject || {}),
                            title: 'Outbound Object',
                            description: 'Outbound configuration (for outbounds[])'
                        },
                        {
                            ...(schema.definitions?.RuleObject || {}),
                            title: 'Rule Object',
                            description: 'Routing rule (for routing.rules[])'
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
