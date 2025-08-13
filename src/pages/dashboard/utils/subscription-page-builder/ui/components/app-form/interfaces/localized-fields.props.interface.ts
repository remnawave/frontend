import {
    IAppConfig,
    ILocalizedText,
    TAdditionalLocales,
    TEnabledLocales
} from '../../../../model/types'

export interface LocalizedFieldsProps {
    field: string
    isDescription?: boolean
    section: string
    updateField: (
        section: keyof IAppConfig,
        field: string,
        lang: TEnabledLocales,
        value: string
    ) => void
    value: ILocalizedText
    additionalLocales: TAdditionalLocales[]
}
