export interface IConditionNode {
    caseSensitive?: unknown
    conditions?: unknown
    headerName?: unknown
    operator?: unknown
    value?: unknown
    versionPattern?: unknown
}

export const OPERATOR_PHRASES: Record<string, [single: string, list: string]> = {
    EQUALS: ['equals', 'equals any of'],
    NOT_EQUALS: ['does not equal', 'equals none of'],
    CONTAINS: ['contains', 'contains any of'],
    NOT_CONTAINS: ['does not contain', 'contains none of'],
    STARTS_WITH: ['starts with', 'starts with any of'],
    NOT_STARTS_WITH: ['does not start with', 'starts with none of'],
    ENDS_WITH: ['ends with', 'ends with any of'],
    NOT_ENDS_WITH: ['does not end with', 'ends with none of'],
    REGEX: ['matches', 'matches any of'],
    NOT_REGEX: ['does not match', 'matches none of'],
    VERSION_EQ: ['version =', 'version ='],
    VERSION_GT: ['version >', 'version >'],
    VERSION_GTE: ['version ≥', 'version ≥'],
    VERSION_LT: ['version <', 'version <'],
    VERSION_LTE: ['version ≤', 'version ≤'],
    EXISTS: ['is present', 'is present'],
    NOT_EXISTS: ['is missing', 'is missing']
}

export const asNode = (value: unknown): IConditionNode =>
    value && typeof value === 'object' && !Array.isArray(value) ? (value as IConditionNode) : {}

export const asText = (value: unknown): string =>
    typeof value === 'string' ? value : (JSON.stringify(value) ?? '')
