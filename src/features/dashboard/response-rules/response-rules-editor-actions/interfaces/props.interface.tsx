import type { editor } from 'monaco-editor'

import { GetSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { Monaco } from '@monaco-editor/react'
import { RefObject } from 'react'

export interface Props {
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>
    hasUnsavedChanges: boolean
    isResponseRulesValid: boolean
    monacoRef: RefObject<Monaco | null>
    originalValue: string
    responseRules: GetSubscriptionSettingsCommand.Response['response']['responseRules']
    setHasUnsavedChanges: (value: boolean) => void
    setIsResponseRulesValid: (value: boolean) => void
    setOriginalValue: (value: string) => void
    setResult: (value: string) => void
    subscriptionSettingsUuid: string
}
