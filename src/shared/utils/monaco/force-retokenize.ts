import type { editor } from 'monaco-editor'

export const forceMonacoRetokenize = (instance: editor.IStandaloneCodeEditor) => {
    instance.getAction('editor.action.forceRetokenize')?.run()
}
