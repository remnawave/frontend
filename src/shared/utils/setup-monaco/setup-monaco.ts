// oxlint-disable

import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor'
import editorWorker from 'monaco-editor/editor/editor.worker?worker'
import 'monaco-editor/features/register.all'
import 'monaco-editor/languages/definitions/yaml/register'
import jsonWorker from 'monaco-editor/languages/features/json/json.worker?worker'
export { jsonDefaults } from 'monaco-editor/languages/features/json/register'

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
