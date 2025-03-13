import { configureMonacoYaml } from 'monaco-yaml'
import { Monaco } from '@monaco-editor/react'
import consola from 'consola'

export const configureMonaco = (monaco: Monaco, language: 'json' | 'yaml') => {
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
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: false,
                enableSchemaRequest: true,
                schemaRequest: 'warning',
                validate: true
            })
        }
    } catch (error) {
        consola.error(`Failed to configure Monaco ${language.toUpperCase()}:`, error)
    }
}
