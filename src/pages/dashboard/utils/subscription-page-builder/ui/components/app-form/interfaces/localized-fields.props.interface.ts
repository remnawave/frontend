import { AppConfig, LocalizedText } from '../../../../model/types'

export interface LocalizedFieldsProps {
    field: string
    isDescription?: boolean
    section: string
    updateField: (
        section: keyof AppConfig,
        field: string,
        lang: keyof LocalizedText,
        value: string
    ) => void
    value: LocalizedText
}
