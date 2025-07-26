import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
    configProfile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    editorRef: any
    isConfigValid: boolean
    monacoRef: any
    setIsConfigValid: (value: boolean) => void
    setResult: (value: string) => void
}
