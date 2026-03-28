import type { editor } from 'monaco-editor'

import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { RefObject } from 'react'

export interface Props {
    configProfile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>
    hasUnsavedChanges: boolean
    isConfigValid: boolean
    originalValue: string
    setHasUnsavedChanges: (value: boolean) => void
    setIsConfigValid: (value: boolean) => void
    setOriginalValue: (value: string) => void
    setResult: (value: string) => void
}
