import type { Monaco } from '@monaco-editor/react'
import type { languages } from 'monaco-editor'

type DiagnosticsOptions = languages.json.DiagnosticsOptions
type JsonSchema = NonNullable<DiagnosticsOptions['schemas']>[number]
type SeverityOptions = Omit<DiagnosticsOptions, 'schemas'>

const DEFAULT_DIAGNOSTICS: SeverityOptions = {
    allowComments: false,
    enableSchemaRequest: true,
    schemaRequest: 'warning',
    validate: true
}

const registry = new Map<string, JsonSchema>()

export const registerJsonSchema = (
    monaco: Monaco,
    schema: JsonSchema,
    diagnostics?: SeverityOptions
) => {
    registry.set(schema.uri, schema)

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        ...DEFAULT_DIAGNOSTICS,
        ...diagnostics,
        schemas: [...registry.values()]
    })
}
