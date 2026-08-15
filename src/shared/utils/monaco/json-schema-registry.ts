import { jsonDefaults } from '@shared/utils/setup-monaco/setup-monaco'

type DiagnosticsOptions = Parameters<typeof jsonDefaults.setDiagnosticsOptions>[0]
type JsonSchema = NonNullable<DiagnosticsOptions['schemas']>[number]
type SeverityOptions = Omit<DiagnosticsOptions, 'schemas'>

const DEFAULT_DIAGNOSTICS: SeverityOptions = {
    allowComments: false,
    enableSchemaRequest: true,
    schemaRequest: 'warning',
    validate: true
}

const registry = new Map<string, JsonSchema>()

export const registerJsonSchema = (schema: JsonSchema, diagnostics?: SeverityOptions) => {
    registry.set(schema.uri, schema)

    jsonDefaults.setDiagnosticsOptions({
        ...DEFAULT_DIAGNOSTICS,
        ...diagnostics,
        schemas: [...registry.values()]
    })
}
