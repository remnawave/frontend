import type { editor } from 'monaco-editor'

export const MONACO_THEME_NAME = 'GithubDark'

export const BASE_MONACO_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoIndent: 'full',
    automaticLayout: true,
    bracketPairColorization: {
        enabled: true,
        independentColorPoolPerBracketType: true
    },
    detectIndentation: true,
    fixedOverflowWidgets: true,
    folding: true,
    foldingStrategy: 'indentation',
    fontSize: 14,
    formatOnPaste: true,
    formatOnType: true,
    guides: {
        bracketPairs: true,
        indentation: true
    },
    insertSpaces: true,
    minimap: { enabled: true },
    padding: {
        top: 10,
        bottom: 10
    },
    stickyScroll: { enabled: false },
    quickSuggestions: true,
    renderLineHighlight: 'all',
    scrollbar: {
        alwaysConsumeMouseWheel: false,
        arrowSize: 30,
        horizontal: 'visible',
        horizontalHasArrows: true,
        useShadows: false,
        vertical: 'visible',
        verticalHasArrows: true
    },
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    tabSize: 2
}

export const COMPACT_MONACO_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
    ...BASE_MONACO_OPTIONS,
    foldingStrategy: 'auto',
    hover: { above: false },
    minimap: { enabled: false },
    scrollbar: {
        alwaysConsumeMouseWheel: false,
        useShadows: false
    }
}
