import { Monaco } from '@monaco-editor/react'
import { consola } from 'consola/browser'
import axios from 'axios'

import { app } from 'src/config'

export const MonacoSetupFeature = {
    setup: async (monaco: Monaco) => {
        try {
            const response = await axios.get(app.configEditor.jsonSchemaUrl)
            const schema = await response.data

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
