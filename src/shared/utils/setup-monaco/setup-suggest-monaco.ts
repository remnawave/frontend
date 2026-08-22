import type { editor } from 'monaco-editor'

const DETAILS_PATCHED = Symbol('remnawave.suggestDetailsPatched')

export function setupSuggestWidget(editor: editor.IStandaloneCodeEditor): void {
    try {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const suggestWidget = (editor.getContribution('editor.contrib.suggestController') as any)
            ?.widget?.value

        if (!suggestWidget) return

        suggestWidget._setDetailsVisible?.(true)
        suggestWidget._persistedSize?.store({ width: 300, height: 300 })

        const details = suggestWidget._details

        if (!details || DETAILS_PATCHED in details) return

        Object.defineProperty(details, DETAILS_PATCHED, { value: true })
        Object.defineProperty(details, '_userSize', {
            configurable: true,
            set: () => {},
            get: () => {
                const anchor = suggestWidget.element?.domNode?.getBoundingClientRect()
                const available = anchor
                    ? document.body.clientWidth - (anchor.left + anchor.width) - 24
                    : 640

                return { width: Math.max(320, Math.min(640, available)), height: 320 }
            }
        })

        suggestWidget._positionDetails?.()
    } catch {
        // silence
    }
}
