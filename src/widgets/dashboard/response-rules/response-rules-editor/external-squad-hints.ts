import type { Monaco } from '@monaco-editor/react'
import type { editor, Position } from 'monaco-editor'

import { getLocation } from 'jsonc-parser'

const UUID_STRING_REGEX = /"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/g
const SQUAD_PATH = [
    'rules',
    '*',
    'responseModifications',
    'subscriptionTemplateByExternalSquad',
    '*',
    'externalSquads',
    '*'
]

export const setupExternalSquadHints = (
    instance: editor.IStandaloneCodeEditor,
    monaco: Monaco,
    getSquadNames: () => ReadonlyMap<string, string>
): void => {
    const completion = monaco.languages.registerCompletionItemProvider('json', {
        triggerCharacters: ['"'],
        provideCompletionItems: (model: editor.ITextModel, position: Position) => {
            if (model !== instance.getModel()) return { suggestions: [] }

            const location = getLocation(model.getValue(), model.getOffsetAt(position))

            if (location.isAtPropertyKey || !location.matches(SQUAD_PATH)) {
                return { suggestions: [] }
            }

            const stringNode =
                location.previousNode?.type === 'string' ? location.previousNode : undefined
            const start = stringNode ? model.getPositionAt(stringNode.offset + 1) : position
            const end = stringNode
                ? model.getPositionAt(stringNode.offset + stringNode.length - 1)
                : position
            const range = new monaco.Range(
                start.lineNumber,
                start.column,
                end.lineNumber,
                end.column
            )

            const suggestions = [...getSquadNames()].map(([uuid, name]) => ({
                documentation: { value: `External Squad **${name}**\n\n\`${uuid}\`` },
                filterText: `${name} ${uuid}`,
                insertText: stringNode ? uuid : JSON.stringify(uuid),
                kind: monaco.languages.CompletionItemKind.Value,
                label: name,
                range,
                sortText: name
            }))

            return { suggestions }
        }
    })

    const inlayHints = monaco.languages.registerInlayHintsProvider('json', {
        provideInlayHints: (model: editor.ITextModel) => {
            if (model !== instance.getModel()) return { hints: [], dispose: () => {} }

            const squadNames = getSquadNames()

            const hints = [...model.getValue().matchAll(UUID_STRING_REGEX)].flatMap((match) => {
                const name = squadNames.get(match[1])

                if (!name) return []

                return [
                    {
                        kind: monaco.languages.InlayHintKind.Type,
                        label: name,
                        paddingLeft: true,
                        paddingRight: true,
                        position: model.getPositionAt(match.index + match[0].length)
                    }
                ]
            })

            return { hints, dispose: () => {} }
        }
    })

    instance.onDidDispose(() => {
        completion.dispose()
        inlayHints.dispose()
    })
}
