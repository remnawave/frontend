import type { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

import { findNodeAtLocation, getNodeValue } from 'jsonc-parser'

import { findRuleNodes, findRulesArray } from './rule-nodes'

const RULE_LENS_TITLE = 'Visualize conditions'
const OVERVIEW_LENS_TITLE = 'Visualize all rules'

interface IHandlers {
    onOpenOverview: (rules: unknown[]) => void
    onOpenRule: (rule: unknown, index: number) => void
}

export const setupConditionsCodeLens = (
    instance: editor.IStandaloneCodeEditor,
    monaco: Monaco,
    handlers: IHandlers
): void => {
    const commandId = instance.addCommand(0, (_accessor, index: unknown) => {
        const model = instance.getModel()

        if (!model || typeof index !== 'number') return

        const ruleNode = findRuleNodes(model.getValue())[index]

        if (!ruleNode || ruleNode.type !== 'object') return

        handlers.onOpenRule(getNodeValue(ruleNode), index + 1)
    })

    const overviewCommandId = instance.addCommand(0, () => {
        const model = instance.getModel()
        const rules = model && findRulesArray(model.getValue())

        if (!rules) return

        const value: unknown = getNodeValue(rules)

        if (Array.isArray(value)) handlers.onOpenOverview(value)
    })

    if (!commandId || !overviewCommandId) return

    const provider = monaco.languages.registerCodeLensProvider('json', {
        provideCodeLenses: (model: editor.ITextModel) => {
            if (model !== instance.getModel()) {
                return { lenses: [], dispose: () => {} }
            }

            const rules = findRulesArray(model.getValue())

            if (!rules) {
                return { lenses: [], dispose: () => {} }
            }

            const lineRange = (offset: number) => {
                const { lineNumber } = model.getPositionAt(offset)

                return {
                    startLineNumber: lineNumber,
                    startColumn: 1,
                    endLineNumber: lineNumber,
                    endColumn: 1
                }
            }

            const ruleLenses = (rules.children ?? []).flatMap((ruleNode, index) => {
                const property = findNodeAtLocation(ruleNode, ['conditions'])?.parent

                if (ruleNode.type !== 'object' || !property) return []

                return [
                    {
                        range: lineRange(property.offset),
                        command: { id: commandId, title: RULE_LENS_TITLE, arguments: [index] }
                    }
                ]
            })

            const overviewLenses = rules.parent
                ? [
                      {
                          range: lineRange(rules.parent.offset),
                          command: { id: overviewCommandId, title: OVERVIEW_LENS_TITLE }
                      }
                  ]
                : []

            return { lenses: [...overviewLenses, ...ruleLenses], dispose: () => {} }
        }
    })

    instance.onDidDispose(() => provider.dispose())
}
