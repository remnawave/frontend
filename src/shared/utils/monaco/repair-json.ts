import type { editor } from 'monaco-editor'

import { jsonrepair } from 'jsonrepair'

export type RepairResult = 'failed' | 'repaired' | 'unchanged'

export const repairJsonInEditor = (instance: editor.IStandaloneCodeEditor): RepairResult => {
    const model = instance.getModel()

    if (!model) return 'failed'

    const currentValue = model.getValue()

    if (!currentValue.trim()) return 'unchanged'

    let repaired: string

    try {
        repaired = jsonrepair(currentValue)
    } catch {
        return 'failed'
    }

    if (repaired === currentValue) return 'unchanged'

    try {
        const parsed: unknown = JSON.parse(repaired)

        if (typeof parsed !== 'object' || parsed === null) return 'failed'
    } catch {
        return 'failed'
    }

    instance.executeEdits('repair-json', [
        {
            range: model.getFullModelRange(),
            text: repaired
        }
    ])
    instance.pushUndoStop()

    instance.getAction('editor.action.formatDocument')?.run()

    return 'repaired'
}
