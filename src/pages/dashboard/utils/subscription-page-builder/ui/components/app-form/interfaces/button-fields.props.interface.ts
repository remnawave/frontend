import { IAppConfig, IButton, TAdditionalLocales } from '../../../../model/types'
import { ButtonSection } from '../lib/button-fields.utils'

export interface ButtonFieldsProps {
    buttons: IButton[]
    localApp: IAppConfig
    section: ButtonSection
    updateApp: (data: Partial<IAppConfig>) => void
    additionalLocales: TAdditionalLocales[]
}
