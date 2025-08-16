import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
    configProfile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    editorRef: any
    hasUnsavedChanges: boolean
    isConfigValid: boolean
    monacoRef: any
    originalValue: string
    setHasUnsavedChanges: (value: boolean) => void
    setIsConfigValid: (value: boolean) => void
    setOriginalValue: (value: string) => void
    setResult: (value: string) => void
}
