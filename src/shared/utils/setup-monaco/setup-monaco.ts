import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

import yamlWorker from './yaml-worker.js?worker'

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            // eslint-disable-next-line new-cap
            return new jsonWorker()
        }
        if (label === 'yaml') {
            // eslint-disable-next-line new-cap
            return new yamlWorker()
        }
        // eslint-disable-next-line new-cap
        return new editorWorker()
    }
}

loader.config({ monaco })

loader.init().then(/* ... */)
