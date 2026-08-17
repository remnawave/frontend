// oxlint-disable

import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor/editor'
import editorWorker from 'monaco-editor/editor/editor.worker?worker'
import 'monaco-editor/features/register.all'
import {
    conf as yamlConf,
    language as yamlLanguage
} from 'monaco-editor/languages/definitions/yaml/yaml'
import jsonWorker from 'monaco-editor/languages/features/json/json.worker?worker'
export { jsonDefaults } from 'monaco-editor/languages/features/json/register'

import { MONACO_THEME_NAME, monacoTheme } from '@shared/constants/monaco-theme'

import yamlWorker from './yaml-worker.js?worker'

const createWorkerByLabel = (label?: string): Worker => {
    if (label === 'json') {
        return new jsonWorker()
    }
    if (label === 'yaml') {
        return new yamlWorker()
    }
    return new editorWorker()
}

self.MonacoEnvironment = {
    getWorker(_, label) {
        return createWorkerByLabel(label)
    }
}

interface ILegacyWebWorkerOptions {
    createData?: unknown
    label?: string
    moduleId?: string
}

type WebWorkerOptions =
    | ILegacyWebWorkerOptions
    | Parameters<typeof monaco.editor.createWebWorker>[0]

const nativeCreateWebWorker = monaco.editor.createWebWorker

monaco.editor.createWebWorker = ((options: WebWorkerOptions) => {
    if ('worker' in options) {
        return nativeCreateWebWorker(options)
    }

    const worker = createWorkerByLabel(options.label)

    worker.postMessage('ignore')
    worker.postMessage(options.createData)

    return nativeCreateWebWorker({ worker })
}) as typeof monaco.editor.createWebWorker

monaco.languages.register({
    id: 'yaml',
    extensions: ['.yaml', '.yml'],
    aliases: ['YAML', 'yaml', 'YML', 'yml'],
    mimetypes: ['application/x-yaml', 'text/x-yaml']
})

monaco.languages.setLanguageConfiguration('yaml', yamlConf)

monaco.languages.setMonarchTokensProvider('yaml', {
    ...yamlLanguage,
    tokenizer: {
        ...yamlLanguage.tokenizer,
        anchor: [[/[&*][^\s,[\]{}]+/, 'namespace']]
    }
})

loader.config({ monaco })

monaco.editor.defineTheme(MONACO_THEME_NAME, {
    ...monacoTheme,
    base: 'vs-dark'
})

loader.init().then(() => {
    monaco.editor.createModel('{}', 'json').dispose()
})
