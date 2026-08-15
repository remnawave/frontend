// oxlint-disable

import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

import { MONACO_THEME_NAME, monacoTheme } from '@shared/constants/monaco-theme'

import yamlWorker from './yaml-worker.js?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'yaml') {
            return new yamlWorker()
        }
        return new editorWorker()
    }
}

loader.config({ monaco })

monaco.editor.defineTheme(MONACO_THEME_NAME, {
    ...monacoTheme,
    base: 'vs-dark'
})

loader.init().then(() => {
    monaco.editor.createModel('{}', 'json').dispose()
})
