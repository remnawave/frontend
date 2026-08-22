import type { editor } from 'monaco-editor'

import { findNodeAtOffset, getLocation, parseTree } from 'jsonc-parser'

import { decodeBase64 } from '@shared/utils/misc/base64'

const ACTION_ID = 'remnawave.openBase64Editor'

export interface IBase64EditorRequest {
    label: string
    onSave: (encoded: string) => void
    value: string
}

const resolveStringNode = (text: string, offset: number) => {
    const root = parseTree(text)

    if (!root) return null

    const node = findNodeAtOffset(root, offset)

    if (!node) return null

    const isPropertyKey = node.parent?.type === 'property' && node.parent.children?.[0] === node
    const target = isPropertyKey ? node.parent?.children?.[1] : node

    if (!target || target.type !== 'string') return null

    return target
}

export const addBase64EditorAction = (
    instance: editor.IStandaloneCodeEditor,
    open: (request: IBase64EditorRequest) => void,
    onInvalid: (message: string) => void
) => {
    instance.addAction({
        id: ACTION_ID,
        label: 'Open base64 editor',
        contextMenuGroupId: '1_modification',
        contextMenuOrder: 1.33,
        run: (target) => {
            const model = target.getModel()
            const position = target.getPosition()

            if (!model || !position) return

            const text = model.getValue()
            const offset = model.getOffsetAt(position)
            const node = resolveStringNode(text, offset)

            if (!node) {
                onInvalid('Place the cursor on a string value')
                return
            }

            const value = String(node.value ?? '')

            if (decodeBase64(value) === null) {
                onInvalid('This value is not valid base64')
                return
            }

            const { path } = getLocation(text, node.offset + 1)

            open({
                label: path.join('.'),
                value,
                onSave: (encoded) => {
                    target.executeEdits(ACTION_ID, [
                        {
                            range: {
                                startLineNumber: model.getPositionAt(node.offset).lineNumber,
                                startColumn: model.getPositionAt(node.offset).column,
                                endLineNumber: model.getPositionAt(node.offset + node.length)
                                    .lineNumber,
                                endColumn: model.getPositionAt(node.offset + node.length).column
                            },
                            text: JSON.stringify(encoded)
                        }
                    ])
                    target.pushUndoStop()
                }
            })
        }
    })
}
