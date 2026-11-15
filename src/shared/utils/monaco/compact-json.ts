import type { editor } from 'monaco-editor'

const INDENT = '  '
const MAX_LINE_LENGTH = 140

const isContainer = (value: unknown): value is object => value !== null && typeof value === 'object'

const isPrimitiveArray = (value: unknown): value is unknown[] =>
    Array.isArray(value) && !value.some(isContainer)

const isFlat = (value: object): boolean =>
    Object.values(value).every(
        (child) =>
            !isContainer(child) ||
            (!Array.isArray(value) && isPrimitiveArray(child) && child.length > 0)
    )

const stringifyInline = (value: unknown): string => {
    if (Array.isArray(value)) {
        return `[${value.map(stringifyInline).join(', ')}]`
    }

    if (isContainer(value)) {
        const entries = Object.entries(value)

        if (entries.length === 0) return '{}'

        return `{ ${entries.map(([key, child]) => `${JSON.stringify(key)}: ${stringifyInline(child)}`).join(', ')} }`
    }

    return JSON.stringify(value) ?? 'null'
}

const wrapPrimitives = (items: unknown[], depth: number): string => {
    const childIndent = INDENT.repeat(depth + 1)
    const lines: string[] = []
    let line = ''

    for (const item of items) {
        const token = JSON.stringify(item) ?? 'null'
        const candidate = line ? `${line}, ${token}` : token

        if (line && childIndent.length + candidate.length + 1 > MAX_LINE_LENGTH) {
            lines.push(line)
            line = token
        } else {
            line = candidate
        }
    }

    lines.push(line)

    return `[\n${lines.map((entry) => `${childIndent}${entry}`).join(',\n')}\n${INDENT.repeat(depth)}]`
}

const stringifyNode = (value: unknown, depth: number, prefixLength: number): string => {
    if (!isContainer(value)) return JSON.stringify(value) ?? 'null'

    const isArray = Array.isArray(value)
    const entries = Object.entries(value)

    if (entries.length === 0) return isArray ? '[]' : '{}'

    if (isFlat(value)) {
        const inline = stringifyInline(value)

        if (depth * INDENT.length + prefixLength + inline.length + 1 <= MAX_LINE_LENGTH) {
            return inline
        }

        if (isPrimitiveArray(value)) {
            return wrapPrimitives(value, depth)
        }
    }

    const childIndent = INDENT.repeat(depth + 1)
    const lines = entries.map(([key, child]) => {
        const prefix = isArray ? '' : `${JSON.stringify(key)}: `

        return `${childIndent}${prefix}${stringifyNode(child, depth + 1, prefix.length)}`
    })

    const [open, close] = isArray ? ['[', ']'] : ['{', '}']

    return `${open}\n${lines.join(',\n')}\n${INDENT.repeat(depth)}${close}`
}

export const stringifyCompactJson = (value: unknown): string => stringifyNode(value, 0, 0)

export const formatEditorAsCompactJson = (instance: editor.IStandaloneCodeEditor): void => {
    const model = instance.getModel()

    if (!model) return

    let parsed: unknown

    try {
        parsed = JSON.parse(model.getValue())
    } catch {
        instance.getAction('editor.action.formatDocument')?.run()
        return
    }

    const formatted = stringifyCompactJson(parsed)

    if (formatted === model.getValue()) return

    instance.pushUndoStop()
    instance.executeEdits('compact-json-format', [
        { range: model.getFullModelRange(), text: formatted }
    ])
    instance.pushUndoStop()
}
