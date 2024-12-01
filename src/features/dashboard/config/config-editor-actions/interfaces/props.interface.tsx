/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
    editorRef: any
    isConfigValid: boolean
    isSaving: boolean
    monacoRef: any
    setIsSaving: (value: boolean) => void
    setResult: (value: string) => void
}
