import type { editor } from 'monaco-editor'

import { GetSnippetsCommand } from '@remnawave/backend-contract'
import { Monaco } from '@monaco-editor/react'
import consola from 'consola/browser'
import { RefObject } from 'react'
import dayjs from 'dayjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replaceSnippetsInArray = (array: any[], snippetsMap: Map<string, unknown>): void => {
    for (let i = array.length - 1; i >= 0; i--) {
        const item = array[i]

        if (item.snippet) {
            const snippet = snippetsMap.get(item.snippet)

            if (snippet) {
                if (Array.isArray(snippet)) {
                    array.splice(i, 1, ...snippet)
                } else {
                    // eslint-disable-next-line no-param-reassign
                    array[i] = snippet
                }
            } else {
                consola.error(`Snippet ${item.snippet} not found`)
                array.splice(i, 1)
            }
        }
    }
}

export const ConfigValidationFeature = {
    validate: (
        editorRef: RefObject<editor.IStandaloneCodeEditor | null>,
        monacoRef: RefObject<Monaco | null>,
        setResult: (message: string) => void,
        setIsConfigValid: (isValid: boolean) => void,
        snippetsMap: Map<
            string,
            GetSnippetsCommand.Response['response']['snippets'][number]['snippet']
        >
    ) => {
        try {
            if (!editorRef.current) return
            if (!monacoRef.current) return

            const currentValue = editorRef.current.getValue()

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let clonedCurrentValue: any
            try {
                clonedCurrentValue = JSON.parse(currentValue)
            } catch {
                setResult(`${dayjs().format('HH:mm:ss')} | Invalid JSON.`)
                setIsConfigValid(false)
                return
            }

            if (clonedCurrentValue.outbounds) {
                replaceSnippetsInArray(clonedCurrentValue.outbounds, snippetsMap)
            }

            if (clonedCurrentValue.routing?.rules) {
                replaceSnippetsInArray(clonedCurrentValue.routing.rules, snippetsMap)
            }

            const validationResult = window.XrayParseConfig(JSON.stringify(clonedCurrentValue))

            setResult(
                `${dayjs().format('HH:mm:ss')} | ${validationResult || 'Xray config is valid.'}`
            )
            setIsConfigValid(!validationResult)
        } catch (err: unknown) {
            setResult(`${dayjs().format('HH:mm:ss')} | Validation error: ${(err as Error).message}`)
            setIsConfigValid(false)
        }
    }
}
