import { getLocation } from 'jsonc-parser'

const LABEL_KEYS = ['tag', 'name', 'ruleTag']

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const step = (value: unknown, key: number | string): unknown => {
    if (typeof key === 'number') {
        return Array.isArray(value) ? value[key] : undefined
    }

    return isRecord(value) ? value[key] : undefined
}

const getLabel = (value: unknown): string | undefined => {
    if (!isRecord(value)) return undefined

    for (const key of LABEL_KEYS) {
        const candidate = value[key]

        if (typeof candidate === 'string' && candidate.length > 0) {
            return candidate
        }
    }

    return undefined
}

export const describeJsonPath = (text: string, offset: number, document: unknown): string[] => {
    const { path } = getLocation(text, offset)
    const segments: string[] = []

    let current = document

    for (const key of path) {
        current = step(current, key)

        if (key === '') continue

        segments.push(typeof key === 'number' ? (getLabel(current) ?? `[${key}]`) : key)
    }

    return segments
}
